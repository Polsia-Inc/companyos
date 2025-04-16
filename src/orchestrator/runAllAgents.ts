import fs from 'fs/promises';
import path from 'path';
import {
    Context,
    AgentBriefInput,
    AgentReplyInput,
    AgentInteraction,
    AgentBrief,
    AgentReply,
    UserResponse,
    ChiefOfStaffInput,
    // AgentStructuredResponse // Keep if CoS needs it later, but not for phase 1 interaction loop
} from '../types.js';
import { getStrategyAgentBrief, getStrategyAgentReply } from '../agents/strategyAgent.js';
import { getEthicsAgentBrief, getEthicsAgentReply } from '../agents/ethicsAgent.js';
import { getWellnessAgentBrief, getWellnessAgentReply } from '../agents/wellnessAgent.js';
import { getProductAgentBrief, getProductAgentReply } from '../agents/productAgent.js';
import { getEngineeringAgentBrief, getEngineeringAgentReply } from '../agents/engineeringAgent.js';
import { getMarketingAgentBrief, getMarketingAgentReply } from '../agents/marketingAgent.js';
import { runChiefOfStaffAgent } from '../agents/chiefOfStaffAgent.js'; // Phase 2
// import * as readline from 'node:readline/promises'; // No longer needed for feedback
// import { stdin as input, stdout as output } from 'node:process'; // No longer needed for feedback
import inquirer from 'inquirer'; // Import inquirer

const CONTEXT_DIR = 'context';
const OUTPUTS_DIR = 'outputs';
const COMPANY_DIR = 'company';
const MEMORY_DIR = 'memory';
const LATEST_CONTEXT_FILE = path.join(CONTEXT_DIR, 'latest.json');
const INITIAL_CONTEXT_FILE = path.join(CONTEXT_DIR, 'context.json');
const COMPANY_SUMMARY_FILE = path.join(COMPANY_DIR, 'summary.md');
const COMPANY_MEMO_FILE = path.join(MEMORY_DIR, 'company-memo.json');
const PULSE_HISTORY_DAYS = 7; // Load last 7 days of history
const AGENT_CONFIG_FILE = path.join('config', 'agents.json'); // Path to new config file

// Define a type for the agent configuration
type AgentConfig = {
    [agentName: string]: { enabled: boolean };
};

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
 * Loads the agent configuration from config/agents.json
 * @returns The AgentConfig object or null if file not found/invalid.
 */
async function loadAgentConfig(): Promise<AgentConfig | null> {
    try {
        const configContent = await fs.readFile(AGENT_CONFIG_FILE, 'utf-8');
        console.log(`Loaded agent configuration from ${AGENT_CONFIG_FILE}`);
        return JSON.parse(configContent) as AgentConfig;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.error(`Error: Agent configuration file not found at ${AGENT_CONFIG_FILE}. Please create it.`);
        } else if (error instanceof SyntaxError) {
             console.error(`Error parsing JSON from ${AGENT_CONFIG_FILE}:`, error);
        } else {
            console.error(`Error reading ${AGENT_CONFIG_FILE}:`, error);
        }
        return null;
    }
}

/**
 * Main orchestrator function - Refactored for v0.2.5 Phase 3.
 */
async function runOrchestrator() {
    console.log("Starting Orchestrator v0.2.5...");

    // 0. Load Agent Configuration
    const agentConfig = await loadAgentConfig();
    if (!agentConfig) {
        console.error("Failed to load agent configuration. Exiting.");
        return;
    }

    // 1. Load Context 
    const currentPulse = await loadCurrentPulse();
    if (!currentPulse) {
        console.error("Failed to load current pulse context. Exiting.");
        return;
    }
    const pulseHistory = await loadPulseHistory(PULSE_HISTORY_DAYS);
    const companySummary = await loadCompanySummary();
    const companyMemo = await loadCompanyMemo();

    // 2. Construct Base Agent Input for Briefs
    const agentBriefInput: AgentBriefInput = {
        currentPulse: currentPulse,
        pulseHistory: pulseHistory.length > 0 ? pulseHistory : undefined,
        companyDocs: companySummary ? { summary: companySummary } : undefined,
        companyMemo: companyMemo ?? undefined, // Pass memo if loaded
    };

    // 3. Define *Available* Agents 
    const allAvailableAgents = [
        { name: 'Strategy', getBrief: getStrategyAgentBrief, getReply: getStrategyAgentReply },
        { name: 'Ethics', getBrief: getEthicsAgentBrief, getReply: getEthicsAgentReply },
        { name: 'Wellness', getBrief: getWellnessAgentBrief, getReply: getWellnessAgentReply },
        { name: 'Product', getBrief: getProductAgentBrief, getReply: getProductAgentReply },
        { name: 'Engineering', getBrief: getEngineeringAgentBrief, getReply: getEngineeringAgentReply },
        { name: 'Marketing', getBrief: getMarketingAgentBrief, getReply: getMarketingAgentReply },
    ];

    // Filter agents based on the loaded configuration
    const enabledAgents = allAvailableAgents.filter(agent => 
        agentConfig[agent.name]?.enabled === true
    );

    if (enabledAgents.length === 0) {
        console.log("No agents enabled in configuration. Skipping one-on-one interactions.");
    } else {
        console.log(`Enabled agents for one-on-one: ${enabledAgents.map(a => a.name).join(', ')}`);
    }

    // 4. Initialize Interaction History
    const interactionHistory: AgentInteraction[] = [];

    // 5. Run Interactive Agent Loop (using *enabled* agents)
    console.log("\n====== 💬 Agent One-on-Ones ======");
    if (enabledAgents.length > 0) {
        for (const agent of enabledAgents) { // Loop through FILTERED agents
            console.log(`\n--- Engaging ${agent.name} Agent ---`);
            let currentInteraction: Partial<AgentInteraction> = { agentName: agent.name, skipped: false };

            try {
                const brief: AgentBrief = await agent.getBrief(agentBriefInput);
                currentInteraction.brief = brief;
                console.log(`\n${agent.name} says:\n${brief}`);

                const { action } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: `Action for ${agent.name}?`,
                        choices: [
                            { name: 'Include these ideas, next agent', value: 'next' },
                            { name: 'Respond (Provide feedback/question)', value: 'respond' },
                            { name: "Don't include, skip agent", value: 'skip' }, 
                        ],
                    },
                ]);

                if (action === 'skip') {
                    console.log(`Skipping ${agent.name} Agent.`);
                    currentInteraction.skipped = true;
                } else if (action === 'respond') {
                    const { userResponse } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'userResponse',
                            message: `Your response to ${agent.name}:`,
                        },
                    ]);
                    currentInteraction.userResponse = userResponse as UserResponse;

                    if (userResponse) { // Only call reply if user actually responded
                        const replyInput: AgentReplyInput = {
                            ...agentBriefInput, 
                            initialBrief: brief,
                            userResponse: userResponse,
                        };
                        const reply: AgentReply = await agent.getReply(replyInput);
                        currentInteraction.agentReply = reply;
                        console.log(`\n${agent.name} replies:\n${reply}`);
                        console.log(`(Continuing to next agent...)`);
                    } else {
                        console.log(`(No response provided, continuing...)`);
                    }

                } else { // action === 'next'
                    console.log(`Continuing past ${agent.name} Agent.`);
                }

            } catch (error) {
                console.error(`Error interacting with ${agent.name} Agent:`, error);
                currentInteraction.brief = currentInteraction.brief ?? `Error during ${agent.name} interaction.`;
                currentInteraction.skipped = true; 
            }
            interactionHistory.push(currentInteraction as AgentInteraction);
        }
    } // End if enabledAgents.length > 0
    console.log("==================================\n");

    // 6. Run Chief of Staff Synthesis (if enabled)
    let chiefOfStaffDirective: string | null = null;
    if (agentConfig['ChiefOfStaff']?.enabled) {
        console.log("\n--- Running Chief of Staff Synthesis ---");
        try {
            const chiefOfStaffInput: ChiefOfStaffInput = {
                ...agentBriefInput, 
                interactionHistory: interactionHistory, // Pass history from *enabled* agents only
            };
            chiefOfStaffDirective = await runChiefOfStaffAgent(chiefOfStaffInput);

            if (chiefOfStaffDirective && typeof chiefOfStaffDirective === 'string') {
                console.log("\n====== 🧠 Chief of Staff Summary ======");
                console.log(chiefOfStaffDirective.trim());
                console.log("====================================\n");
            } else {
                 console.log("\nChief of Staff directive was not generated or is not a string.\n");
            }
        } catch (error) {
            console.error(`Error running Chief of Staff Agent:`, error);
            chiefOfStaffDirective = `Chief of Staff Agent failed to run: ${error instanceof Error ? error.message : String(error)}`;
        }
    } else {
        console.log("--- Chief of Staff Agent disabled in configuration. Skipping synthesis. ---");
    }


    // 7. Save Outputs
    console.log("--- Saving Outputs ---");
    const outputDate = new Date().toISOString().split('T')[0];
    const outputFilenameJson = `${outputDate}.json`;
    const outputFilenameMd = `${outputDate}.summary.md`;
    const outputFilePathJson = path.join(OUTPUTS_DIR, outputFilenameJson);
    const outputFilePathMd = path.join(OUTPUTS_DIR, outputFilenameMd);

    const outputData = {
        date: outputDate,
        config_used: agentConfig, // Include config used for this run
        context_used: { 
             currentPulse: agentBriefInput.currentPulse,
             pulseHistoryCount: agentBriefInput.pulseHistory?.length ?? 0,
             companySummaryLoaded: !!agentBriefInput.companyDocs?.summary,
             companyMemoLoaded: !!agentBriefInput.companyMemo,
        },
        interactions: interactionHistory, 
        chief_of_staff_summary: chiefOfStaffDirective, 
    };

    try {
        await fs.mkdir(OUTPUTS_DIR, { recursive: true });
        await fs.writeFile(outputFilePathJson, JSON.stringify(outputData, null, 2));
        console.log(`Successfully wrote detailed output to ${outputFilePathJson}`);

        // Only write summary MD if CoS was enabled and produced output
        if (agentConfig['ChiefOfStaff']?.enabled && chiefOfStaffDirective && typeof chiefOfStaffDirective === 'string') {
            await fs.writeFile(outputFilePathMd, chiefOfStaffDirective);
            console.log(`Successfully wrote summary to ${outputFilePathMd}`);
        } else {
            if (!agentConfig['ChiefOfStaff']?.enabled) {
                 console.log(`Skipping summary file write because Chief of Staff agent was disabled.`);
            } else {
                 console.warn(`Skipping summary file write because Chief of Staff directive was not available or not a string.`);
            }
        }

    } catch (error) {
        console.error(`Error writing output files:`, error);
    }

    console.log("Orchestrator finished.");
}

// Run the orchestrator
runOrchestrator(); 