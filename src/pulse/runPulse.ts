import fs from 'fs/promises';
import path from 'path';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { Context } from '../types.js';

const CONTEXT_DIR = 'context';
const LATEST_CONTEXT_FILE = path.join(CONTEXT_DIR, 'latest.json');

/**
 * Asks a question using readline and returns the answer.
 * 
 * @param rl The readline interface instance.
 * @param question The question to ask the user.
 * @returns A promise resolving to the user's answer string.
 */
async function askQuestion(rl: readline.Interface, question: string): Promise<string> {
    const answer = await rl.question(question + '\n> ');
    return answer.trim();
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
        console.log(`
Capturing Pulse for: ${dateString}`);
        console.log("(Leave blank if not applicable. Separate list items like blockers/feedback with commas)");
        console.log("---");

        const goal = await askQuestion(rl, "🎯 Today's Primary Goal?");
        const blockersRaw = await askQuestion(rl, "🚧 Current Blockers / Friction? (comma-separated)");
        const feedbackRaw = await askQuestion(rl, "💡 Recent User Feedback / Insights? (comma-separated)");
        const energy = await askQuestion(rl, "✨ Energy Level? (e.g., Low, Medium, High)");
        const emotion = await askQuestion(rl, "😊 Emotional State? (e.g., Focused, Tired, Optimistic)");

        console.log("---");
        console.log("Pulse captured. Saving...");

        const newContext: Context = {
            date: dateString,
            goal: goal || 'Not specified',
            blockers: blockersRaw ? blockersRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
            user_feedback: feedbackRaw ? feedbackRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
            energy_level: energy || 'Not specified',
            emotional_state: emotion || 'Not specified',
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