import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
// Import shared types
import { AgentInput_v0_2, AgentStructuredResponse } from '../types.js';
// Import the actual LLM call function
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remove placeholder LLM function
// async function callLLM(prompt: string): Promise<string> { ... }

/**
 * Parses the Chief of Staff LLM response string.
 * Tries to find a JSON block, otherwise returns the trimmed string.
 * TODO: Refine parsing based on actual expected CoS output format.
 * @param llmResponse Raw LLM response.
 * @returns The directive string or an error message.
 */
function parseChiefOfStaffResponse(llmResponse: string | null): string {
    const agentName = "ChiefOfStaff";
    if (!llmResponse) {
        console.error(`${agentName} Agent received null response from LLM.`);
        return `Error: Failed to get response from ${agentName} LLM.`;
    }

    try {
        // Simple parsing: Look for JSON block (optional)
        const jsonMatch = llmResponse.match(/```json\n(\{.*?\})\n```/s);
        if (jsonMatch && jsonMatch[1]) {
            const parsed = JSON.parse(jsonMatch[1]);
            // Assuming the directive is a top-level field if JSON is used
            if (parsed && typeof parsed.directive === 'string') {
                return parsed.directive.trim();
            }
        }
        // If no JSON block or directive field, return the whole trimmed response
        return llmResponse.trim();
    } catch (error) {
        console.error(`Error parsing JSON response for ${agentName} Agent:`, error);
        console.error('Raw Response:', llmResponse);
        // Return the raw response with an error prefix if parsing failed
        return `Error parsing CoS response (returning raw): ${llmResponse.trim()}`;
    }
}

/**
 * Runs the Chief of Staff Agent.
 * Temporarily uses the old input/output types.
 */
export async function runChiefOfStaffAgent(input: AgentInput_v0_2): Promise<string> { // Output is string (directive)
    const promptPath = path.join(__dirname, '../../prompts/chiefOfStaffPrompt.txt');
    let promptTemplate: string;
    try {
        // Use fs.promises.readFile for async operation
        promptTemplate = await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
        console.error(`Error reading CoS prompt template ${promptPath}:`, error);
        return "Error: Failed to load CoS prompt template.";
    }

    // Construct the prompt using AgentInput_v0_2 structure
    const combinedPrompt = `
${promptTemplate}

# Current Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

## Other Agent Reports:
${JSON.stringify(input.otherAgentReports || {}, null, 2)}

## Company Memo (if available):
${input.companyMemo ? JSON.stringify(input.companyMemo, null, 2) : 'Not available'}

# Chief of Staff Synthesis:
`;

    try {
        const llmResponse = await callLLM(combinedPrompt);
        const directive = parseChiefOfStaffResponse(llmResponse);
        console.log("Chief of Staff Agent finished.");
        return directive;
    } catch (error) {
        console.error(`Error during Chief of Staff Agent LLM call:`, error);
        return "Critical Error: Exception during Chief of Staff agent execution.";
    }
} 