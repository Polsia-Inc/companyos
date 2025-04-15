import fs from 'fs/promises';
import path from 'path';
import { AgentInput, AgentResponse } from '../types.js';
import { callLLM } from '../utils/llm.js';

const PROMPT_TEMPLATE_PATH = path.join('prompts', 'strategyPrompt.txt');

/**
 * Loads the prompt template from the file system.
 * 
 * @returns The prompt template string or null if not found.
 */
async function loadPromptTemplate(): Promise<string | null> {
    try {
        return await fs.readFile(PROMPT_TEMPLATE_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${PROMPT_TEMPLATE_PATH}:`, error);
        return null;
    }
}

/**
 * Constructs a prompt for the Strategy Agent by loading a template
 * and injecting context data.
 * 
 * @param input The input context for the agent.
 * @param template The prompt template string.
 * @returns The constructed prompt string.
 */
function constructStrategyPromptFromTemplate(input: AgentInput, template: string): string {
    let prompt = template;
    
    // Replace basic pulse placeholders
    prompt = prompt.replace('{{date}}', input.currentPulse.date);
    prompt = prompt.replace('{{goal}}', input.currentPulse.goal);
    prompt = prompt.replace('{{blockers}}', input.currentPulse.blockers.join(', ') || 'None');
    prompt = prompt.replace('{{user_feedback}}', input.currentPulse.user_feedback.join(', ') || 'None');
    prompt = prompt.replace('{{energy_level}}', input.currentPulse.energy_level);
    prompt = prompt.replace('{{emotional_state}}', input.currentPulse.emotional_state);

    // Replace optional pulse history placeholder
    let historyText = '';
    if (input.pulseHistory && input.pulseHistory.length > 0) {
        historyText = `\n\nRecent Pulse History (last ${input.pulseHistory.length} days):
`;
        input.pulseHistory.forEach(hist => {
            historyText += `- ${hist.date}: Goal: ${hist.goal}, State: ${hist.emotional_state}\n`;
        });
    }
    prompt = prompt.replace('{{pulse_history}}', historyText.trim());

    // Replace optional company summary placeholder
    let summaryText = '';
    if (input.companyDocs) {
        summaryText = `\n\nCompany Summary:
${input.companyDocs.summary}
`;
    }
    prompt = prompt.replace('{{company_summary}}', summaryText.trim());
    
    // Clean up potential double newlines if optional sections were empty
    prompt = prompt.replace(/\n\n\n/g, '\n\n'); 

    return prompt;
}

/**
 * Parses the LLM response string into an AgentResponse object.
 * Assumes a specific format: numbered recommendations, bulleted concerns, confidence score.
 * 
 * @param llmResponse The raw string response from the LLM.
 * @returns An AgentResponse object or null if parsing fails.
 */
function parseLLMResponse(llmResponse: string): Partial<AgentResponse> {
    const response: Partial<AgentResponse> = {
        recommendations: [],
        concerns: [],
        confidence: undefined
    };
    const lines = llmResponse.trim().split('\n');

    lines.forEach(line => {
        line = line.trim();
        if (line.match(/^\d+\.\s+/)) { // Matches lines starting with "1.", "2.", etc.
            response.recommendations?.push(line.replace(/^\d+\.\s+/, ''));
        } else if (line.startsWith('*')) { // Matches lines starting with "*"
            response.concerns?.push(line.substring(1).trim());
        } else if (line.match(/^\d+(\.\d+)?$/)) { // Matches a number (int or float) on its own line
            const score = parseFloat(line);
            if (!isNaN(score)) {
                response.confidence = Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
            }
        }
    });

    return response;
}

/**
 * Runs the Strategy Agent.
 * 
 * Loads a prompt template, injects context, calls an LLM, 
 * and parses the response.
 * 
 * @param input The input context for the agent.
 * @returns A promise that resolves to the agent's response.
 */
export async function runStrategyAgent(input: AgentInput): Promise<AgentResponse> {
    console.log(`Running Strategy Agent with goal: ${input.currentPulse.goal}`);

    const template = await loadPromptTemplate();
    if (!template) {
        console.error("Failed to load strategy prompt template. Using fallback response.");
        return {
            agent: "strategy",
            recommendations: ["Error: Failed to load prompt template."],
            concerns: [],
            confidence: 0.0,
        };
    }

    const prompt = constructStrategyPromptFromTemplate(input, template);
    // console.log("\n--- Constructed Prompt ---\n", prompt, "\n------------------------\n"); // Uncomment for debugging
    const llmResponse = await callLLM(prompt);

    let parsedData: Partial<AgentResponse> = {};
    if (llmResponse) {
        parsedData = parseLLMResponse(llmResponse);
    } else {
        console.error("Strategy Agent received no response from LLM.");
    }

    const finalResponse: AgentResponse = {
        agent: "strategy",
        recommendations: parsedData.recommendations?.length ? parsedData.recommendations : ["LLM call failed or parsing error."],
        concerns: parsedData.concerns || [],
        confidence: parsedData.confidence ?? 0.0, // Default confidence if missing
    };

    console.log("Strategy Agent finished.");
    return finalResponse;
} 