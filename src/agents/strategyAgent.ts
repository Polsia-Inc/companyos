import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
import { AgentInput, AgentResponse } from '../types.js';
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPT_TEMPLATE_PATH = path.join(__dirname, '../../prompts/strategyPrompt.txt');

/**
 * Parses the LLM response string (expected to be JSON) into an AgentResponse object.
 * Uses the robust JSON parsing logic from other agents.
 * @param llmResponse The raw string response from the LLM.
 * @returns An AgentResponse object.
 */
function parseStrategyResponse(llmResponse: string | null): AgentResponse {
    const agentName = "strategy";
    const defaultResponse: AgentResponse = {
        agent: agentName,
        recommendations: [`Error: Failed to parse LLM response for ${agentName} agent.`],
        concerns: [],
        flags: [],
        confidence: 0.0,
    };

    if (!llmResponse) {
        console.error(`${agentName} Agent received null response from LLM.`);
        return defaultResponse;
    }

    try {
        const jsonMatch = llmResponse.match(/```json\n(\{.*?\})\n```/s);
        if (!jsonMatch || !jsonMatch[1]) {
             console.error(`Could not find JSON block in ${agentName} LLM response.`);
             try {
                  const parsed = JSON.parse(llmResponse);
                  if (parsed && typeof parsed === 'object') {
                      return {
                          agent: parsed.agent || agentName,
                          recommendations: parsed.recommendations || [],
                          concerns: parsed.concerns || [],
                          flags: parsed.flags || [],
                          confidence: parsed.confidence ?? 0.0,
                      };
                  } else { throw new Error('Parsed content is not a valid object.'); }
             } catch (directParseError) {
                  console.error(`Direct JSON parsing failed for ${agentName}:`, directParseError);
                  console.error('Raw Response:', llmResponse);
                  return { ...defaultResponse, recommendations: [`Error: Could not parse LLM response for ${agentName}. Raw output logged.`] };
             }
        }
        const jsonString = jsonMatch[1];
        const parsed = JSON.parse(jsonString);
        if (parsed && typeof parsed === 'object') {
            return {
                agent: parsed.agent || agentName,
                recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
                concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
                flags: Array.isArray(parsed.flags) ? parsed.flags : [],
                confidence: (typeof parsed.confidence === 'number') ? Math.max(0, Math.min(1, parsed.confidence)) : 0.0,
            };
        } else {
            console.error(`Parsed JSON is not a valid object for ${agentName}.`);
            return defaultResponse;
        }
    } catch (error) {
        console.error(`Error parsing JSON response for ${agentName} Agent:`, error);
        console.error('Raw Response:', llmResponse);
        return { ...defaultResponse, recommendations: [`Error: Could not parse LLM response for ${agentName}. Raw output logged.`] };
    }
}

/**
 * Runs the Strategy Agent.
 */
export async function runStrategyAgent(input: AgentInput): Promise<AgentResponse> {
    let template: string;
    try {
        template = await fs.readFile(PROMPT_TEMPLATE_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${PROMPT_TEMPLATE_PATH}:`, error);
         return {
            agent: "strategy",
            recommendations: ["Error: Failed to load prompt template."],
            concerns: [], flags: [], confidence: 0.0,
        };
    }

    // Basic prompt construction - can be refined if needed
    const combinedPrompt = `
${template}

# Current Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

## Other Agent Reports:
${JSON.stringify(input.otherAgentReports || {}, null, 2)}

## Company Memo (if available):
${input.companyMemo ? JSON.stringify(input.companyMemo, null, 2) : 'Not available'}

# Strategy Agent Analysis:
`;

    try {
        const llmResponse = await callLLM(combinedPrompt);
        const structuredResponse = parseStrategyResponse(llmResponse);
        console.log("Strategy Agent finished.");
        return structuredResponse;
    } catch (error) {
        console.error(`Error during Strategy Agent LLM call:`, error);
        return {
            agent: "strategy",
            recommendations: [`Critical Error: Exception during Strategy agent execution.`],
            concerns: [], flags: [], confidence: 0.0,
        };
    }
} 