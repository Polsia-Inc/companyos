import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable not set.');
    console.log('Please create a .env file in the root directory and add your OpenAI API key.');
    console.log('Example .env file:');
    console.log('OPENAI_API_KEY=your_actual_api_key_here');
    // In a real application, you might want to exit or throw an error
    // For now, we'll allow it to proceed but the client initialization will likely fail
    // or subsequent calls will error.
}

const openai = new OpenAI({
    apiKey: apiKey, // apiKey can be undefined here if not set, OpenAI client handles this
});

/**
 * Calls the configured LLM with the given prompt.
 * 
 * @param prompt The prompt string to send to the LLM.
 * @param model The model to use (e.g., 'gpt-4o', 'gpt-3.5-turbo'). Defaults to 'gpt-4o'.
 * @returns A promise that resolves to the LLM's response content or null if an error occurs.
 */
export async function callLLM(prompt: string, model: string = 'gpt-4o'): Promise<string | null> {
    if (!apiKey) {
        console.error('Cannot call LLM: OPENAI_API_KEY is not set.');
        return null;
    }
    
    try {
        console.log(`Calling ${model} with prompt...`); // Basic logging
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: model,
        });

        const content = completion.choices[0]?.message?.content;
        console.log('LLM call successful.'); // Basic logging
        return content || null;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return null;
    }
}

// Example usage (can be removed later)
// async function testLLM() {
//     const response = await callLLM("Tell me a short story about a robot.");
//     if (response) {
//         console.log("\nLLM Response:");
//         console.log(response);
//     } else {
//         console.log("\nFailed to get LLM response.");
//     }
// }
// testLLM(); 