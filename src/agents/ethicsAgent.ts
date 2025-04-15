import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
import { AgentInput, AgentResponse } from '../types.js';
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPT_TEMPLATE_PATH = path.join(__dirname, '../../prompts/ethicsPrompt.txt');

/**
 * Parses the LLM response string (expected to be JSON) into an AgentResponse object.
 * @param llmResponse The raw string response from the LLM.
 * @returns An AgentResponse object.
 */
function parseEthicsResponse(llmResponse: string | null): AgentResponse {
    const agentName = "ethics";
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
 * Runs the Ethics Agent.
 */
export async function runEthicsAgent(input: AgentInput): Promise<AgentResponse> {
    console.log("Running Ethics Agent...");
    let template: string;
    try {
        template = await fs.readFile(PROMPT_TEMPLATE_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${PROMPT_TEMPLATE_PATH}:`, error);
        return {
            agent: "ethics",
            recommendations: ["Error: Failed to load prompt template."],
            concerns: [], flags: [], confidence: 0.0,
        };
    }

    const combinedPrompt = `
${template}

# Current Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

## Other Agent Reports:
${JSON.stringify(input.otherAgentReports || {}, null, 2)}

## Company Memo (if available):
${input.companyMemo ? JSON.stringify(input.companyMemo, null, 2) : 'Not available'}

# Ethics Agent Analysis:
`;

    try {
        const llmResponse = await callLLM(combinedPrompt);
        const structuredResponse = parseEthicsResponse(llmResponse);
        console.log("Ethics Agent finished.");
        return structuredResponse;
    } catch (error) {
        console.error(`Error during Ethics Agent LLM call:`, error);
        return {
            agent: "ethics",
            recommendations: [`Critical Error: Exception during Ethics agent execution.`],
            concerns: [], flags: [], confidence: 0.0,
        };
    }
} 