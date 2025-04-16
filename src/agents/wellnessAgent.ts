import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
import { AgentBriefInput, AgentBrief, AgentReplyInput, AgentReply, AgentStructuredResponse, AgentInput_v0_2 } from '../types.js';
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRIEF_PROMPT_PATH = path.join(__dirname, '../../prompts/wellnessBriefPrompt.txt');
const REPLY_PROMPT_PATH = path.join(__dirname, '../../prompts/wellnessReplyPrompt.txt');
const AGENT_NAME = "Wellness";

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
            // Wellness specific
            if (typeof parsed.observation === 'string' && parsed.observation.trim()) {
                 outputLines.push(parsed.observation.trim());
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
 * Generates the initial brief for the Wellness Agent.
 */
export async function getWellnessAgentBrief(input: AgentBriefInput): Promise<AgentBrief> {
    let template: string;
    try {
        template = await fs.readFile(BRIEF_PROMPT_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${BRIEF_PROMPT_PATH}:`, error);
        return "Error: Wellness Agent failed to load brief prompt template.";
    }

    // Wellness agent likely only needs the current pulse
    const combinedPrompt = `
${template}

# Current Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

# Instructions:
Generate a brief, concise (1-3 sentences) opening statement for the Wellness agent based *only* on the user's pulse (energy level, emotional state, feedback).
Focus on acknowledging their current state or potential wellness factors.
Do not ask questions, just provide your initial assessment.

# Wellness Agent Brief:
`;

    try {
        const llmResponse = await callLLM(combinedPrompt);
        const brief = parseLLMStringResponse(llmResponse, 'brief');
        console.log("Wellness Agent brief generated.");
        return brief;
    } catch (error) {
        console.error(`Error during Wellness Agent brief LLM call:`, error);
        return "Critical Error: Exception during Wellness agent brief generation.";
    }
}

/**
 * Generates the follow-up reply for the Wellness Agent based on user response.
 */
export async function getWellnessAgentReply(input: AgentReplyInput): Promise<AgentReply> {
    let template: string;
    try {
        template = await fs.readFile(REPLY_PROMPT_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${REPLY_PROMPT_PATH}:`, error);
        return "Error: Wellness Agent failed to load reply prompt template.";
    }

    // Reply likely needs original pulse, initial brief, and user response
    const combinedPrompt = `
${template}

# Original Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

# Conversation History:

## Your Initial Brief:
${input.initialBrief}

## User's Response:
${input.userResponse}

# Instructions:
Generate a concise (1-3 sentences) follow-up reply based on the user's response, considering the original pulse and your initial brief.
Acknowledge the user's input and provide a relevant wellness observation, tip, or encouragement.
Do not ask follow-up questions.

# Wellness Agent Reply:
`;

    try {
        const llmResponse = await callLLM(combinedPrompt);
        const reply = parseLLMStringResponse(llmResponse, 'reply');
        console.log("Wellness Agent reply generated.");
        return reply;
    } catch (error) {
        console.error(`Error during Wellness Agent reply LLM call:`, error);
        return "Critical Error: Exception during Wellness agent reply generation.";
    }
}

// --- Deprecated v0.2 Agent --- 
/*
function parseWellnessResponse_v0_2(llmResponse: string | null): AgentStructuredResponse { ... }
export async function runWellnessAgent_v0_2(input: AgentInput_v0_2): Promise<AgentStructuredResponse> { ... }
*/ 