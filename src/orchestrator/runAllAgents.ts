import fs from 'fs/promises';
import path from 'path';
import { AgentInput, AgentResponse, Context } from '../types.js';
import { runStrategyAgent } from '../agents/strategyAgent.js';
import { runEthicsAgent } from '../agents/ethicsAgent.js';
import { runWellnessAgent } from '../agents/wellnessAgent.js';

const CONTEXT_DIR = 'context';
const OUTPUTS_DIR = 'outputs';
const COMPANY_DIR = 'company';
const LATEST_CONTEXT_FILE = path.join(CONTEXT_DIR, 'latest.json');
const INITIAL_CONTEXT_FILE = path.join(CONTEXT_DIR, 'context.json');
const COMPANY_SUMMARY_FILE = path.join(COMPANY_DIR, 'summary.md');
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

    // 2. Construct Agent Input
    const agentInput: AgentInput = {
        currentPulse: currentPulse,
        pulseHistory: pulseHistory.length > 0 ? pulseHistory : undefined,
        companyDocs: companySummary ? { summary: companySummary } : undefined,
    };

    // 3. Run Agents (Updated to run all MVP agents)
    const agentResponses: AgentResponse[] = [];
    
    // Run Strategy Agent
    try {
        console.log("\n--- Running Strategy Agent ---");
        const strategyResponse = await runStrategyAgent(agentInput);
        agentResponses.push(strategyResponse);
        console.log("--- Strategy Agent Complete ---");
    } catch (error) {
        console.error("Error running Strategy Agent:", error);
        agentResponses.push({ agent: "strategy", recommendations: ["Agent failed to run."], confidence: 0.0 });
    }

    // Run Ethics Agent
    try {
        console.log("\n--- Running Ethics Agent ---");
        const ethicsResponse = await runEthicsAgent(agentInput);
        agentResponses.push(ethicsResponse);
        console.log("--- Ethics Agent Complete ---");
    } catch (error) {
        console.error("Error running Ethics Agent:", error);
        agentResponses.push({ agent: "ethics", recommendations: ["Agent failed to run."], confidence: 0.0 });
    }

    // Run Wellness Agent
    try {
        console.log("\n--- Running Wellness Agent ---");
        const wellnessResponse = await runWellnessAgent(agentInput);
        agentResponses.push(wellnessResponse);
        console.log("--- Wellness Agent Complete ---\n");
    } catch (error) {
        console.error("Error running Wellness Agent:", error);
        agentResponses.push({ agent: "wellness", recommendations: ["Agent failed to run."], confidence: 0.0 });
    }

    // 4. Format and Save Output
    const outputDate = new Date().toISOString().split('T')[0];
    const outputFilePath = path.join(OUTPUTS_DIR, `${outputDate}.json`);

    const outputData = {
        date: outputDate,
        context_used: {
            currentPulse: currentPulse,
            pulseHistoryCount: pulseHistory.length,
            companySummaryLoaded: !!companySummary,
        },
        responses: agentResponses.reduce((acc, res) => {
            acc[res.agent] = res; // Group responses by agent name
            return acc;
        }, {} as { [key: string]: AgentResponse }),
        creative_director_input: { // Placeholder
            notes: null,
            manual_overrides: {},
        },
    };

    try {
        await fs.mkdir(OUTPUTS_DIR, { recursive: true }); // Ensure output directory exists
        await fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2));
        console.log(`Successfully wrote output to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error writing output file ${outputFilePath}:`, error);
    }

    console.log("Orchestrator finished.");
}

// Run the orchestrator
runOrchestrator(); 