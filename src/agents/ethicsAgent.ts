import fs from 'fs/promises';
import path from 'path';
import { AgentInput, AgentResponse } from '../types.js';
import { callLLM } from '../utils/llm.js';

const PROMPT_TEMPLATE_PATH = path.join('prompts', 'ethicsPrompt.txt');

// Re-usable function to load template (could be moved to a shared utils file later)
async function loadPromptTemplate(): Promise<string | null> {
    try {
        return await fs.readFile(PROMPT_TEMPLATE_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${PROMPT_TEMPLATE_PATH}:`, error);
        return null;
    }
}

// Re-usable function to construct prompt (could be moved/generalized later)
function constructPromptFromTemplate(input: AgentInput, template: string): string {
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
 * Parses the LLM response string for the Ethics Agent.
 * Assumes format: bulleted flags, assessment phrase, confidence score.
 * 
 * @param llmResponse The raw string response from the LLM.
 * @returns A partial AgentResponse object specific to ethics.
 */
function parseEthicsLLMResponse(llmResponse: string): Partial<AgentResponse> & { assessment?: string } {
    const response: Partial<AgentResponse> & { assessment?: string } = {
        flags: [],
        assessment: "Assessment missing",
        confidence: undefined
    };
    const lines = llmResponse.trim().split('\n');
    let foundAssessment = false;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('*')) { // Matches lines starting with "*"
            const flag = line.substring(1).trim();
            if (flag.toLowerCase() !== 'none') {
                response.flags?.push(flag);
            }
        } else if (line.match(/^\d+(\.\d+)?$/)) { // Matches confidence score
            const score = parseFloat(line);
            if (!isNaN(score)) {
                response.confidence = Math.max(0, Math.min(1, score)); // Clamp
            }
        } else if (line && !foundAssessment) { // Assume the first non-empty, non-flag, non-score line is the assessment
            response.assessment = line;
            foundAssessment = true; 
        }
    });

    // Handle case where '* None' was the only flag
    if (response.flags?.length === 0 && llmResponse.includes('* None')) {
       // Keep flags array empty, assessment should be captured separately 
    }

    return response;
}

/**
 * Runs the Ethics Agent.
 * 
 * Loads template, injects context, calls LLM, parses response.
 * 
 * @param input The input context for the agent.
 * @returns A promise that resolves to the agent's response.
 */
export async function runEthicsAgent(input: AgentInput): Promise<AgentResponse> {
    console.log("Running Ethics Agent...");

    const template = await loadPromptTemplate();
    if (!template) {
        return {
            agent: "ethics",
            recommendations: [], // Ethics agent doesn't give recommendations
            flags: ["Error: Failed to load prompt template."],
            confidence: 0.0,
        };
    }

    const prompt = constructPromptFromTemplate(input, template);
    const llmResponse = await callLLM(prompt);

    let parsedData: Partial<AgentResponse> & { assessment?: string } = {};
    if (llmResponse) {
        parsedData = parseEthicsLLMResponse(llmResponse);
    } else {
        console.error("Ethics Agent received no response from LLM.");
    }

    // Adapt the structure slightly for ethics - store assessment maybe in recommendations or a custom field?
    // For now, let's put assessment as the first recommendation for simplicity.
    const finalResponse: AgentResponse = {
        agent: "ethics",
        recommendations: [parsedData.assessment || "Assessment failed."], // Using recommendations to store assessment phrase
        flags: parsedData.flags || [],
        concerns: [], // Concerns not explicitly asked for in this version
        confidence: parsedData.confidence ?? 0.0,
    };

    console.log("Ethics Agent finished.");
    return finalResponse;
} 