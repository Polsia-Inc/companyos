import fs from 'fs/promises';
import path from 'path';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { Context } from '../types.js';

const CONTEXT_DIR = 'context';
const LATEST_CONTEXT_FILE = path.join(CONTEXT_DIR, 'latest.json');

/**
 * Asks a question using readline and returns the answer.
 * Allows specifying if the question is required.
 * 
 * @param rl The readline interface instance.
 * @param question The question to ask the user.
 * @param required If true, reprompts until a non-empty answer is given.
 * @returns A promise resolving to the user's answer string.
 */
async function askQuestion(rl: readline.Interface, question: string, required: boolean = false): Promise<string> {
    let answer = '';
    do {
        answer = (await rl.question(question + (required ? ' (required)' : '') + '\n> ')).trim();
        if (required && !answer) {
            console.log("This field is required. Please provide an answer.");
        }
    } while (required && !answer);
    return answer;
}

/**
 * Asks for energy level and validates it lightly.
 * 
 * @param rl The readline interface instance.
 * @returns A promise resolving to the validated energy level string.
 */
async function askEnergyLevel(rl: readline.Interface): Promise<string> {
    const validLevels = ['low', 'medium', 'high', 'drained', 'energized']; // Example valid inputs
    let answer = '';
    let isValid = false;
    do {
        answer = await askQuestion(rl, "✨ Energy Level? (e.g., Low, Medium, High)");
        // Basic validation: check if input is non-empty or somewhat matches expected values
        isValid = !!answer; // At least require something
        if (!isValid) {
            console.log("Please describe your energy level.");
        }
        // Optional: more strict validation against known terms
        // if (isValid && !validLevels.includes(answer.toLowerCase())) {
        //     console.log(`Input "${answer}" not recognized, but proceeding. Consider using terms like: ${validLevels.join(', ')}`);
        // }
    } while (!isValid);
    return answer;
}

/**
 * Main function to run the daily pulse.
 */
async function runPulse() {
    console.log("Starting Daily Pulse...");
    const rl = readline.createInterface({ input, output });

    try {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
        console.log(`\nCapturing Pulse for: ${dateString}`);
        console.log("(Leave blank if not applicable, unless marked required. Separate list items like blockers/feedback with commas)");
        console.log("---");

        const goal = await askQuestion(rl, "🎯 Today's Primary Goal?", true); // Make goal required
        const blockersRaw = await askQuestion(rl, "🚧 Current Blockers / Friction? (comma-separated)");
        const feedbackRaw = await askQuestion(rl, "💡 Recent User Feedback / Insights? (comma-separated)");
        const energy = await askEnergyLevel(rl); // Use validated energy input
        const emotion = await askQuestion(rl, "😊 Emotional State? (e.g., Focused, Tired, Optimistic)", true); // Make emotion required

        console.log("---");
        console.log("Pulse captured. Saving...");

        const newContext: Context = {
            date: dateString,
            goal: goal, // Already validated as required
            blockers: blockersRaw ? blockersRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
            user_feedback: feedbackRaw ? feedbackRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
            energy_level: energy, // Already validated
            emotional_state: emotion, // Already validated as required
        };

        // Save to date-specific file
        const dailyFilePath = path.join(CONTEXT_DIR, `${dateString}.json`);
        await fs.writeFile(dailyFilePath, JSON.stringify(newContext, null, 2));
        console.log(`Saved daily context to ${dailyFilePath}`);

        // Update latest.json (simple copy for now)
        await fs.copyFile(dailyFilePath, LATEST_CONTEXT_FILE);
        console.log(`Updated ${LATEST_CONTEXT_FILE}`);

    } catch (error) {
        console.error("Error running Pulse:", error);
    } finally {
        rl.close();
    }

    console.log("Daily Pulse finished.");
}

// Run the pulse script
runPulse(); 