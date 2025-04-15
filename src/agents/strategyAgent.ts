import { AgentInput, AgentResponse } from '../types.js';
import { callLLM } from '../utils/llm.js';

/**
 * Constructs a prompt for the Strategy Agent based on the input context.
 * 
 * @param input The input context for the agent.
 * @returns The constructed prompt string.
 */
function constructStrategyPrompt(input: AgentInput): string {
    // Basic prompt construction - this will be refined later using templates (Phase 3)
    let prompt = `You are the Strategy Agent for an AI-Native company called CompanyOS.
    The Creative Director (human operator) has provided the following daily pulse:
    - Date: ${input.currentPulse.date}
    - Today's Goal: ${input.currentPulse.goal}
    - Blockers: ${input.currentPulse.blockers.join(', ') || 'None'}
    - User Feedback: ${input.currentPulse.user_feedback.join(', ') || 'None'}
    - Energy Level: ${input.currentPulse.energy_level}
    - Emotional State: ${input.currentPulse.emotional_state}
`;

    if (input.pulseHistory && input.pulseHistory.length > 0) {
        prompt += `\n\nRecent Pulse History (last ${input.pulseHistory.length} days):
`;
        input.pulseHistory.forEach(hist => {
            prompt += `- ${hist.date}: Goal: ${hist.goal}, State: ${hist.emotional_state}\n`;
        });
    }

    if (input.companyDocs) {
        prompt += `\n\nCompany Summary:
${input.companyDocs.summary}
`;
    }

    prompt += `\nBased on the current pulse, recent history, and company summary, please provide:
1.  Your top 3 strategic recommendations for today as a numbered list.
2.  Any potential concerns or risks as a bulleted list (prefix with *).
3.  An overall confidence score (0.0 to 1.0) for your recommendations, as a single number on a new line.

Respond ONLY with the numbered recommendations, bulleted concerns, and the confidence score, each on new lines where appropriate. Do not include any other explanatory text.`;

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
 * Constructs a prompt using the input context,
 * calls an LLM, and parses the response.
 * 
 * @param input The input context for the agent.
 * @returns A promise that resolves to the agent's response.
 */
export async function runStrategyAgent(input: AgentInput): Promise<AgentResponse> {
    console.log(`Running Strategy Agent with goal: ${input.currentPulse.goal}`);

    const prompt = constructStrategyPrompt(input);
    const llmResponse = await callLLM(prompt);

    let parsedData: Partial<AgentResponse> = {};
    if (llmResponse) {
        parsedData = parseLLMResponse(llmResponse);
    } else {
        console.error("Strategy Agent received no response from LLM.");
    }

    const finalResponse: AgentResponse = {
        agent: "strategy",
        recommendations: parsedData.recommendations || ["LLM call failed or parsing error."],
        concerns: parsedData.concerns || [],
        confidence: parsedData.confidence ?? 0.0, // Default confidence if missing
    };

    console.log("Strategy Agent finished.");
    return finalResponse;
} 