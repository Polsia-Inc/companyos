import fs from 'fs/promises';
import path from 'path';
import { AgentInput, AgentResponse, Context } from '../types.js';
import { runStrategyAgent } from '../agents/strategyAgent.js';
import { runEthicsAgent } from '../agents/ethicsAgent.js';
import { runWellnessAgent } from '../agents/wellnessAgent.js';
import { runProductAgent } from '../agents/productAgent.js';
import { runEngineeringAgent } from '../agents/engineeringAgent.js';
import { runMarketingAgent } from '../agents/marketingAgent.js';
import { runChiefOfStaffAgent } from '../agents/chiefOfStaffAgent.js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const CONTEXT_DIR = 'context';
const OUTPUTS_DIR = 'outputs';
const COMPANY_DIR = 'company';
const MEMORY_DIR = 'memory';
const LATEST_CONTEXT_FILE = path.join(CONTEXT_DIR, 'latest.json');
const INITIAL_CONTEXT_FILE = path.join(CONTEXT_DIR, 'context.json');
const COMPANY_SUMMARY_FILE = path.join(COMPANY_DIR, 'summary.md');
const COMPANY_MEMO_FILE = path.join(MEMORY_DIR, 'company-memo.json');
const PULSE_HISTORY_DAYS = 7; // Load last 7 days of history

/**
 * Loads the most recent pulse context.
 * Tries latest.json first, then falls back to context.json.
 * 
 * @returns The latest Context object or null if not found.
 */
async function loadCurrentPulse(): Promise<Context | null> {
    try {
        const data = await fs.readFile(LATEST_CONTEXT_FILE, 'utf-8');
        console.log(`Loaded current pulse from ${LATEST_CONTEXT_FILE}`);
        return JSON.parse(data) as Context;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log(`${LATEST_CONTEXT_FILE} not found, trying ${INITIAL_CONTEXT_FILE}`);
            try {
                const data = await fs.readFile(INITIAL_CONTEXT_FILE, 'utf-8');
                console.log(`Loaded initial pulse from ${INITIAL_CONTEXT_FILE}`);
                return JSON.parse(data) as Context;
            } catch (fallbackError: any) {
                console.error(`Error reading ${INITIAL_CONTEXT_FILE}:`, fallbackError);
                return null;
            }
        } else {
            console.error(`Error reading ${LATEST_CONTEXT_FILE}:`, error);
            return null;
        }
    }
}

/**
 * Loads the pulse history for the last N days.
 * 
 * @param daysToLoad Number of past days to load history for.
 * @returns An array of Context objects, potentially empty.
 */
async function loadPulseHistory(daysToLoad: number): Promise<Context[]> {
    const history: Context[] = [];
    const today = new Date();
    console.log(`Attempting to load pulse history for the last ${daysToLoad} days.`);

    for (let i = 1; i <= daysToLoad; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const filePath = path.join(CONTEXT_DIR, `${dateString}.json`);

        try {
            const data = await fs.readFile(filePath, 'utf-8');
            history.push(JSON.parse(data) as Context);
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                // Log errors other than file not found
                console.warn(`Warning: Error reading pulse history file ${filePath}:`, error.message);
            }
            // Silently ignore if file doesn't exist for a specific day
        }
    }
    console.log(`Loaded ${history.length} historical pulse files.`);
    // Sort history from oldest to newest (optional, but can be helpful for prompts)
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return history;
}

/**
 * Loads the company summary document.
 * 
 * @returns The company summary content as a string or null if not found.
 */
async function loadCompanySummary(): Promise<string | null> {
    try {
        const summary = await fs.readFile(COMPANY_SUMMARY_FILE, 'utf-8');
        console.log(`Loaded company summary from ${COMPANY_SUMMARY_FILE}`);
        return summary;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.warn(`Warning: ${COMPANY_SUMMARY_FILE} not found.`);
        } else {
            console.error(`Error reading ${COMPANY_SUMMARY_FILE}:`, error);
        }
        return null;
    }
}

/**
 * Loads the company memo JSON object.
 * 
 * @returns The company memo object or null if not found/invalid.
 */
async function loadCompanyMemo(): Promise<object | null> {
    try {
        const memoContent = await fs.readFile(COMPANY_MEMO_FILE, 'utf-8');
        console.log(`Loaded company memo from ${COMPANY_MEMO_FILE}`);
        return JSON.parse(memoContent);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.warn(`Warning: ${COMPANY_MEMO_FILE} not found.`);
        } else if (error instanceof SyntaxError) {
             console.error(`Error parsing JSON from ${COMPANY_MEMO_FILE}:`, error);
        } else {
            console.error(`Error reading ${COMPANY_MEMO_FILE}:`, error);
        }
        return null;
    }
}

/**
 * Prompts the user for feedback on agent outputs.
 * @param agentName The name of the agent being reviewed.
 * @param agentOutput The output produced by the agent (string or object).
 * @param rl The readline interface.
 * @returns A promise resolving to the feedback object.
 */
async function getFeedbackForAgent(agentName: string, agentOutput: string | AgentResponse | null, rl: readline.Interface): Promise<{ rating: number | null; notes: string | null }> {
    console.log(`\n--- Reviewing ${agentName} Agent ---`);
    // Display output snippet for context (adjust snippet logic as needed)
    let outputSnippet = 'No output or failed.';
    if (typeof agentOutput === 'string') {
        outputSnippet = agentOutput.substring(0, 300) + (agentOutput.length > 300 ? '...' : '');
    } else if (agentOutput && typeof agentOutput === 'object') {
        // Handle AgentResponse object - maybe show recommendations?
        outputSnippet = JSON.stringify(agentOutput.recommendations || agentOutput.flags || agentOutput.concerns || 'No specific items found').substring(0, 300) + '...';
    }
    console.log(`Output Snippet:\n${outputSnippet}`);

    let rating: number | null = null;
    while (rating === null) {
        const ratingInput = await rl.question(`Rate ${agentName} output (1-5, 0 to skip): `);
        const parsedRating = parseInt(ratingInput, 10);
        if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
            rating = parsedRating === 0 ? null : parsedRating; // Store null if skipped
        } else {
            console.log("Invalid input. Please enter a number between 1 and 5, or 0 to skip.");
        }
    }

    const notes = await rl.question(`Notes for ${agentName} (optional): `);

    return { rating, notes: notes || null };
}

/**
 * Main orchestrator function.
 */
async function runOrchestrator() {
    console.log("Starting Orchestrator...");

    // 1. Load Context
    const currentPulse = await loadCurrentPulse();
    if (!currentPulse) {
        console.error("Failed to load current pulse context. Exiting.");
        return;
    }

    const pulseHistory = await loadPulseHistory(PULSE_HISTORY_DAYS);
    const companySummary = await loadCompanySummary();
    const companyMemo = await loadCompanyMemo();

    // 2. Construct Agent Input
    const baseAgentInput: AgentInput = {
        currentPulse: currentPulse,
        pulseHistory: pulseHistory.length > 0 ? pulseHistory : undefined,
        companyDocs: companySummary ? { summary: companySummary } : undefined,
    };

    // 3. Run Agents (Tier 1 Council + Chief of Staff)
    const agentResponses: { [key: string]: string | AgentResponse } = {};

    // Helper to run an agent and store its result or error
    const runAgent = async (name: string, agentFn: (input: AgentInput) => Promise<string | AgentResponse>) => {
        try {
            console.log(`\n--- Running ${name} Agent ---`);
            const response = await agentFn(baseAgentInput);
            agentResponses[name.toLowerCase()] = response; // Store response keyed by lowercase name
            console.log(`--- ${name} Agent Complete ---`);
        } catch (error) {
            console.error(`Error running ${name} Agent:`, error);
            // Store a simplified error object or message
            agentResponses[name.toLowerCase()] = `Agent ${name} failed to run: ${error instanceof Error ? error.message : String(error)}`;
        }
    };

    // Define agents to run in order
    const agentsToRun: { name: string; runner: (input: AgentInput) => Promise<string | AgentResponse> }[] = [
        { name: 'Strategy', runner: runStrategyAgent },
        { name: 'Ethics', runner: runEthicsAgent },
        { name: 'Wellness', runner: runWellnessAgent },
        { name: 'Product', runner: runProductAgent },
        { name: 'Engineering', runner: runEngineeringAgent },
        { name: 'Marketing', runner: runMarketingAgent },
    ];

    // Run agents sequentially and collect responses
    for (const agent of agentsToRun) {
        await runAgent(agent.name, agent.runner);
    }

    // 3.5 Run Chief of Staff Agent (after all others)
    let chiefOfStaffDirective: string | null = null;
    try {
        console.log(`\n--- Running Chief of Staff Agent ---`);
        const chiefOfStaffInput: AgentInput = {
            ...baseAgentInput,
            otherAgentReports: agentResponses,
            companyMemo: companyMemo ?? undefined,
        };
        chiefOfStaffDirective = await runChiefOfStaffAgent(chiefOfStaffInput);
        console.log(`--- Chief of Staff Agent Complete ---`);

        // Print the formatted directive to the console
        if (chiefOfStaffDirective && typeof chiefOfStaffDirective === 'string') {
            console.log("\n====== 🧠 Chief of Staff Summary ======");
            console.log(chiefOfStaffDirective.trim()); // Trim to remove leading/trailing whitespace
            console.log("====================================\n");
        } else {
             console.log("\nChief of Staff directive was not generated or is not a string.\n");
        }
    } catch (error) {
        console.error(`Error running Chief of Staff Agent:`, error);
        chiefOfStaffDirective = `Chief of Staff Agent failed to run: ${error instanceof Error ? error.message : String(error)}`;
    }

    // 4. Format and Save Output
    const outputDate = new Date().toISOString().split('T')[0];
    const outputFilePath = path.join(OUTPUTS_DIR, `${outputDate}.json`);

    // Define the structure for the output data, including the feedback field
    const outputData: {
        date: string;
        context_used: any;
        responses: { [key: string]: string | AgentResponse };
        chief_of_staff_summary: string | null;
        creative_director_input: {
            notes: string | null;
            manual_overrides: object;
            agent_feedback?: { // Make feedback optional initially
                [agentName: string]: { rating: number | null; notes: string | null };
            };
        };
    } = {
        date: outputDate,
        context_used: {
            currentPulse: currentPulse,
            pulseHistoryCount: pulseHistory.length,
            companySummaryLoaded: !!companySummary,
            companyMemoLoaded: !!companyMemo,
        },
        responses: agentResponses,
        chief_of_staff_summary: chiefOfStaffDirective,
        creative_director_input: { // Initialize matching the defined structure
            notes: null,
            manual_overrides: {},
            // agent_feedback will be added later if user provides feedback
        },
    };

    try {
        await fs.mkdir(OUTPUTS_DIR, { recursive: true }); // Ensure output directory exists
        await fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2));
        console.log(`Successfully wrote output to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error writing output file ${outputFilePath}:`, error);
    }

    // Write the Chief of Staff summary to a separate Markdown file
    if (chiefOfStaffDirective && typeof chiefOfStaffDirective === 'string') {
        const summaryFilePath = path.join(OUTPUTS_DIR, `${outputDate}.summary.md`);
        try {
            await fs.writeFile(summaryFilePath, chiefOfStaffDirective);
            console.log(`Successfully wrote summary to ${summaryFilePath}`);
        } catch (summaryWriteError) {
            console.error(`Error writing summary file ${summaryFilePath}:`, summaryWriteError);
        }
    } else {
        console.warn("Skipping summary file write because Chief of Staff directive was not available.");
    }

    // 5. Optional Feedback Loop
    const rl = readline.createInterface({ input, output });
    try {
        const collectFeedback = await rl.question('\nDo you want to provide feedback on the agent outputs? (y/N) ');
        if (collectFeedback.toLowerCase() === 'y') {
            console.log("\n--- Starting Feedback Loop --- ");
            // We need to read the file we just wrote to get the structured data
            // Alternatively, we could work with the outputData object directly
            const feedbackData = outputData; // Work with the in-memory object directly
            // Initialize agent_feedback if it doesn't exist (it shouldn't initially)
            feedbackData.creative_director_input.agent_feedback = {};

            // Iterate through agent responses
            for (const agentName in feedbackData.responses) {
                const agentFeedback = await getFeedbackForAgent(agentName, feedbackData.responses[agentName], rl);
                if (agentFeedback.rating !== null || agentFeedback.notes !== null) {
                    feedbackData.creative_director_input.agent_feedback[agentName] = agentFeedback;
                }
            }

            // Get feedback for Chief of Staff separately
            if (feedbackData.chief_of_staff_summary) {
                 const cosFeedback = await getFeedbackForAgent('ChiefOfStaff', feedbackData.chief_of_staff_summary, rl);
                 if (cosFeedback.rating !== null || cosFeedback.notes !== null) {
                     feedbackData.creative_director_input.agent_feedback['chief_of_staff'] = cosFeedback;
                 }
            }

            // Re-write the output file with feedback
            try {
                await fs.writeFile(outputFilePath, JSON.stringify(feedbackData, null, 2));
                console.log(`\nUpdated output file ${outputFilePath} with feedback.`);
            } catch (writeError) {
                console.error(`Error writing updated output file ${outputFilePath}:`, writeError);
            }
        }
    } catch (feedbackError) {
        console.error("Error during feedback loop:", feedbackError);
    } finally {
        rl.close();
    }

    console.log("Orchestrator finished.");
}

// Run the orchestrator
runOrchestrator(); 