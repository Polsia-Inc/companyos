import fs from 'fs/promises';
import path from 'path';
import { AgentInput, AgentResponse } from '../types.js';
import { callLLM } from '../utils/llm.js';

const PROMPT_TEMPLATE_PATH = path.join('prompts', 'wellnessPrompt.txt');

// Re-usable function to load template
async function loadPromptTemplate(): Promise<string | null> {
    try {
        return await fs.readFile(PROMPT_TEMPLATE_PATH, 'utf-8');
    } catch (error) {
        console.error(`Error reading prompt template ${PROMPT_TEMPLATE_PATH}:`, error);
        return null;
    }
}

// Re-usable function to construct prompt
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
            // Include energy/emotion for wellness context
            historyText += `- ${hist.date}: State: ${hist.emotional_state}, Energy: ${hist.energy_level}\n`;
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
    
    // Clean up potential double newlines
    prompt = prompt.replace(/\n\n\n/g, '\n\n'); 

    return prompt;
}

/**
 * Parses the LLM response string for the Wellness Agent.
 * Assumes format: bulleted recommendations, assessment phrase, confidence score.
 * 
 * @param llmResponse The raw string response from the LLM.
 * @returns A partial AgentResponse object specific to wellness.
 */
function parseWellnessLLMResponse(llmResponse: string): Partial<AgentResponse> & { assessment?: string } {
    const response: Partial<AgentResponse> & { assessment?: string } = {
        recommendations: [],
        assessment: "Assessment missing",
        confidence: undefined
    };
    const lines = llmResponse.trim().split('\n');
    let foundAssessment = false;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('*')) { // Matches lines starting with "*"
            const recommendation = line.substring(1).trim();
             if (recommendation.toLowerCase() !== 'maintain current pace') {
                 response.recommendations?.push(recommendation);
             }
        } else if (line.match(/^\d+(\.\d+)?$/)) { // Matches confidence score
            const score = parseFloat(line);
            if (!isNaN(score)) {
                response.confidence = Math.max(0, Math.min(1, score)); // Clamp
            }
        } else if (line && !foundAssessment) { // Assume the first non-empty, non-bullet, non-score line is the assessment
            response.assessment = line;
            foundAssessment = true; 
        }
    });
    
     // Handle case where '* Maintain current pace' was the only recommendation
    if (response.recommendations?.length === 0 && llmResponse.includes('* Maintain current pace')) {
       // Keep recommendations array empty
    }

    return response;
}

/**
 * Runs the Wellness Agent.
 * 
 * Loads template, injects context, calls LLM, parses response.
 * 
 * @param input The input context for the agent.
 * @returns A promise that resolves to the agent's response.
 */
export async function runWellnessAgent(input: AgentInput): Promise<AgentResponse> {
    console.log("Running Wellness Agent...");

    const template = await loadPromptTemplate();
    if (!template) {
        return {
            agent: "wellness",
            recommendations: ["Error: Failed to load prompt template."],
            concerns: [],
            confidence: 0.0,
        };
    }

    const prompt = constructPromptFromTemplate(input, template);
    const llmResponse = await callLLM(prompt);

    let parsedData: Partial<AgentResponse> & { assessment?: string } = {};
    if (llmResponse) {
        parsedData = parseWellnessLLMResponse(llmResponse);
    } else {
        console.error("Wellness Agent received no response from LLM.");
    }

    // Store assessment in concerns field for wellness?
    // Or add a dedicated field to AgentResponse (better for long term)
    // For now, using concerns to hold the assessment phrase.
    const finalResponse: AgentResponse = {
        agent: "wellness",
        recommendations: parsedData.recommendations || [],
        concerns: [parsedData.assessment || "Assessment failed."], // Using concerns to store assessment phrase
        flags: [], // Flags not explicitly asked for in this version
        confidence: parsedData.confidence ?? 0.0,
    };

    console.log("Wellness Agent finished.");
    return finalResponse;
} 