import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
// Import shared types
import { AgentInput, AgentResponse } from '../types.js';
// Import the actual LLM call function
import { callLLM } from '../utils/llm.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remove placeholder LLM function
// async function callLLM(prompt: string): Promise<string> { ... }

// We expect the AgentInput to potentially contain reports from *all* other agents
export async function runChiefOfStaffAgent(input: AgentInput): Promise<string> {
  const promptPath = path.join(__dirname, '../../prompts/chiefOfStaffPrompt.txt');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // Construct the prompt, including all available context
  const combinedPrompt = `
${promptTemplate}

# Current Context:

## Pulse:
${JSON.stringify(input.currentPulse, null, 2)}

## Agent Reports:
${JSON.stringify(input.otherAgentReports || {}, null, 2)}

## Company Memo (if available):
${input.companyMemo ? JSON.stringify(input.companyMemo, null, 2) : 'Not available'}

# Chief of Staff Synthesis:
`;

  try {
    // Call the imported LLM function
    const directive = await callLLM(combinedPrompt);
    // Handle potential null response from LLM
    return directive ?? 'Chief of Staff Agent LLM call failed or returned null.';
  } catch (error) {
    console.error('Error running Chief of Staff Agent:', error);
    // Return a string indicating failure
    return `Chief of Staff Agent failed: ${error instanceof Error ? error.message : String(error)}`;
  }
} 