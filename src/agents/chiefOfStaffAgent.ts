import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
// Import shared types
import { AgentInteraction, ChiefOfStaffInput } from '../types.js';
// Import the actual LLM call function
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remove placeholder LLM function
// async function callLLM(prompt: string): Promise<string> { ... }

/**
 * Parses the Chief of Staff LLM response string.
 * Assumes the response is the directive string itself.
 * TODO: Refine parsing if CoS needs to return structured data.
 * @param llmResponse Raw LLM response.
 * @returns The directive string or an error message.
 */
function parseChiefOfStaffResponse(llmResponse: string | null): string {
    const agentName = "ChiefOfStaff";
    if (!llmResponse) {
        console.error(`${agentName} Agent received null response from LLM.`);
        return `Error: Failed to get response from ${agentName} LLM.`;
    }
    // For now, assume the raw response is the directive. Trim it.
    return llmResponse.trim(); 
    /* // Previous logic attempting JSON parsing - keep commented if needed later
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
    */
}

/**
 * Formats the interaction history for the prompt.
 */
function formatInteractionHistory(history: AgentInteraction[]): string {
    if (!history || history.length === 0) {
        return "No agent interactions recorded.";
    }

    let formatted = "";
    for (const interaction of history) {
        formatted += `\n--- ${interaction.agentName} Agent Interaction ---\n`;
        if (interaction.skipped) {
            formatted += `Status: Skipped by user.\n`;
            continue; // Don't include brief/reply if skipped
        }
        if (interaction.brief) {
            formatted += `Agent Initial Brief:\n${interaction.brief}\n`;
        }
        if (interaction.userResponse) {
            formatted += `\nUser Response:\n${interaction.userResponse}\n`;
            if (interaction.agentReply) {
                 formatted += `\nAgent Follow-up Reply:\n${interaction.agentReply}\n`;
            } else {
                formatted += `(Agent provided no further reply after user response)\n`;
            }
        } else {
            formatted += `(User chose 'Next' - no response given)\n`;
        }
         formatted += `-------------------------------------\n`;
    }
    return formatted.trim();
}

/**
 * Runs the Chief of Staff Agent using the interaction history.
 */
export async function runChiefOfStaffAgent(input: ChiefOfStaffInput): Promise<string> { // Output is string (directive)
    const promptPath = path.join(__dirname, '../../prompts/chiefOfStaffPrompt.txt');
    let promptTemplate: string;
    try {
        promptTemplate = await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
        console.error(`Error reading CoS prompt template ${promptPath}:`, error);
        return "Error: Failed to load CoS prompt template.";
    }

    // Construct the prompt using ChiefOfStaffInput and formatted interaction history
    const formattedHistory = formatInteractionHistory(input.interactionHistory);

    const combinedPrompt = `
${promptTemplate}

# Current Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

## Agent Interactions History:
${formattedHistory}

## Company Memo (if available):
${input.companyMemo ? JSON.stringify(input.companyMemo, null, 2) : 'Not available'}

# Chief of Staff Synthesis Task:
Synthesize the Pulse, Agent Interactions History (considering briefs, responses, replies, and skips), and Company Memo into a final, prioritized daily directive (e.g., Do, Delay, Delegate, Ignore). Provide reasoning.

# Chief of Staff Directive:
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