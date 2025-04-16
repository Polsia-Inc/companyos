import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
import { AgentBriefInput, AgentBrief, AgentReplyInput, AgentReply, AgentStructuredResponse, AgentInput_v0_2 } from '../types.js';
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRIEF_PROMPT_PATH = path.join(__dirname, '../../prompts/ethicsBriefPrompt.txt');
const REPLY_PROMPT_PATH = path.join(__dirname, '../../prompts/ethicsReplyPrompt.txt');
const AGENT_NAME = "Ethics";

/**
 * Parses the LLM response to extract and format relevant fields into a conversational string.
 * Attempts to parse JSON, formats fields like recommendations/concerns, 
 * otherwise returns the trimmed raw response.
 * @param llmResponse The raw string response from the LLM.
 * @param agentAction Type of action (brief or reply) for logging.
 * @returns The formatted conversational string or an error message.
 */
function parseLLMStringResponse(llmResponse: string | null, agentAction: 'brief' | 'reply'): string {
    if (!llmResponse) {
        console.error(`${AGENT_NAME} Agent received null ${agentAction} response from LLM.`);
        return `Error: Failed to get ${agentAction} from LLM.`;
    }

    const trimmedResponse = llmResponse.trim();

    // Attempt to parse as JSON
    try {
        let potentialJson = trimmedResponse;
        // Handle potential markdown code blocks
        const jsonMatch = trimmedResponse.match(/```(?:json)?\n?(\{.*?\})\n?```/s);
        if (jsonMatch && jsonMatch[1]) {
            potentialJson = jsonMatch[1];
        }

        const parsed = JSON.parse(potentialJson);
        const outputLines: string[] = [];

        // --- Format relevant fields from JSON --- 
        if (parsed && typeof parsed === 'object') {
            // Add specific fields first if they exist
            if (typeof parsed.brief === 'string' && parsed.brief.trim()) {
                outputLines.push(parsed.brief.trim());
            }
             if (typeof parsed.reply === 'string' && parsed.reply.trim()) {
                outputLines.push(parsed.reply.trim());
            }
             if (typeof parsed.message === 'string' && parsed.message.trim()) {
                 outputLines.push(parsed.message.trim());
            }
             if (typeof parsed.summary === 'string' && parsed.summary.trim()) {
                outputLines.push(parsed.summary.trim());
            }

            // Format common structured fields 
            if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
                outputLines.push("Recommendations:");
                parsed.recommendations.forEach((rec: unknown) => {
                    if (typeof rec === 'string' && rec.trim()) {
                        outputLines.push(`- ${rec.trim()}`);
                    }
                });
            }
            if (Array.isArray(parsed.concerns) && parsed.concerns.length > 0) {
                 if (outputLines.length > 0 && !outputLines[outputLines.length -1].startsWith("Concerns:")) outputLines.push("");
                outputLines.push("Concerns:");
                parsed.concerns.forEach((con: unknown) => {
                    if (typeof con === 'string' && con.trim()) {
                        outputLines.push(`- ${con.trim()}`);
                    }
                });
            }
             if (Array.isArray(parsed.flags) && parsed.flags.length > 0) {
                 if (outputLines.length > 0 && !outputLines[outputLines.length -1].startsWith("Flags:")) outputLines.push("");
                 outputLines.push("Flags:");
                parsed.flags.forEach((flag: unknown) => {
                    if (typeof flag === 'string' && flag.trim()) {
                        outputLines.push(`- ${flag.trim()}`);
                    }
                });
            }
            
            // If we found and formatted fields, join them
            if (outputLines.length > 0) {
                return outputLines.join('\n');
            }
        }
        
        // If JSON parsed but was empty or had no relevant fields, return raw 
        console.warn(`${AGENT_NAME} Agent parsed JSON but found no relevant fields to format (${agentAction}). Returning raw response.`);
        return trimmedResponse; 

    } catch (error) {
        // If JSON parsing fails, assume it's plain text
        if (error instanceof SyntaxError) {
             return trimmedResponse;
        } else {
             console.error(`Unexpected error parsing ${agentAction} response for ${AGENT_NAME}:`, error);
             return `Error: Unexpected parsing issue for ${agentAction}.`;
        }
    }
}

/**
 * Generates the initial brief for the Ethics Agent.
 */
export async function getEthicsAgentBrief(input: AgentBriefInput): Promise<AgentBrief> {
    let template: string;
    try {
        template = await fs.readFile(BRIEF_PROMPT_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${BRIEF_PROMPT_PATH}:`, error);
        return "Error: Ethics Agent failed to load brief prompt template.";
    }

    const combinedPrompt = `
${template}

# Current Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

## Company Memo (if available):
${input.companyMemo ? JSON.stringify(input.companyMemo, null, 2) : 'Not available'}

# Instructions:
Generate a brief, concise (1-3 sentences) opening statement for the Ethics agent based on the context.
Focus on potential ethical considerations, value alignment, or risks based *only* on the Pulse and Memo provided.
Do not ask questions, just provide your initial assessment.

# Ethics Agent Brief:
`;

    try {
        const llmResponse = await callLLM(combinedPrompt);
        const brief = parseLLMStringResponse(llmResponse, 'brief');
        console.log("Ethics Agent brief generated.");
        return brief;
    } catch (error) {
        console.error(`Error during Ethics Agent brief LLM call:`, error);
        return "Critical Error: Exception during Ethics agent brief generation.";
    }
}

/**
 * Generates the follow-up reply for the Ethics Agent based on user response.
 */
export async function getEthicsAgentReply(input: AgentReplyInput): Promise<AgentReply> {
    let template: string;
    try {
        template = await fs.readFile(REPLY_PROMPT_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${REPLY_PROMPT_PATH}:`, error);
        return "Error: Ethics Agent failed to load reply prompt template.";
    }

    const combinedPrompt = `
${template}

# Original Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

## Company Memo (if available):
${input.companyMemo ? JSON.stringify(input.companyMemo, null, 2) : 'Not available'}

# Conversation History:

## Your Initial Brief:
${input.initialBrief}

## User's Response:
${input.userResponse}

# Instructions:
Generate a concise (1-3 sentences) follow-up reply based on the user's response, considering the original context and your initial brief.
Acknowledge the user's input and provide a relevant ethical reflection or clarification.
Do not ask follow-up questions.

# Ethics Agent Reply:
`;

    try {
        const llmResponse = await callLLM(combinedPrompt);
        const reply = parseLLMStringResponse(llmResponse, 'reply');
        console.log("Ethics Agent reply generated.");
        return reply;
    } catch (error) {
        console.error(`Error during Ethics Agent reply LLM call:`, error);
        return "Critical Error: Exception during Ethics agent reply generation.";
    }
}

// --- Deprecated v0.2 Agent --- 
// Original runEthicsAgent and parseEthicsResponse logic can be commented out or removed later.
/*
function parseEthicsResponse_v0_2(llmResponse: string | null): AgentStructuredResponse { ... }
export async function runEthicsAgent_v0_2(input: AgentInput_v0_2): Promise<AgentStructuredResponse> { ... }
*/ 