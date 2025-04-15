import * as fs from 'fs';
import * as path from 'path';
// Add url import for ESM compatible __dirname
import * as url from 'url';
// Import the shared AgentInput type
import { AgentInput, AgentResponse } from '../types.js';
// Import the actual LLM call function
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remove placeholder LLM function
// async function callLLM(prompt: string): Promise<string> { ... }

// Remove local AgentInput definition
// interface AgentInput { ... }

/**
 * Parses the LLM response string (expected to be JSON) into an AgentResponse object.
 */
function parseMarketingResponse(llmResponse: string | null): AgentResponse {
    const agentName = "marketing"; // Define agent name
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
                  } else {
                       throw new Error('Parsed content is not a valid object.');
                  }
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

// Use the imported AgentInput type
export async function runMarketingAgent(input: AgentInput): Promise<AgentResponse> {
  // Construct path relative to current file using ESM compatible __dirname
  const promptPath = path.join(__dirname, '../../prompts/marketingPrompt.txt');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // Adjust how pulse data is accessed based on the imported AgentInput type
  const combinedPrompt = `
${promptTemplate}

# Current Context:
## Pulse:
${JSON.stringify(input.currentPulse, null, 2)} // Use input.currentPulse directly or specific fields

## Other Agent Reports:
${JSON.stringify(input.otherAgentReports || {}, null, 2)}

# Marketing Agent Analysis:
`;

  try {
    // Call the imported LLM function
    const response = await callLLM(combinedPrompt);
    // Parse the response
    const structuredResponse = parseMarketingResponse(response);
    return structuredResponse;
  } catch (error) {
    console.error(`Error running Marketing Agent LLM call:`, error);
    return {
        agent: "marketing",
        recommendations: [`Critical Error: Exception during ${name} agent execution.`],
        concerns: [],
        flags: [],
        confidence: 0.0,
    };
  }
} 