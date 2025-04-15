import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
// Import shared types
import { AgentInput, AgentResponse } from '../types.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Placeholder for the actual LLM call function - assumed shared/refactored
async function callLLM(prompt: string): Promise<string> {
  console.log('--- Mock LLM Call Start (ChiefOfStaff) ---');
  console.log(prompt.substring(0, 500) + '...'); // Log more for debugging complex prompts
  console.log('--- Mock LLM Call End (ChiefOfStaff) ---');
  // Placeholder response adhering to the requested format
  const mockDirective = `
TODAY'S DIRECTIVE:

✅ DO:
   1. Placeholder: Address critical issue from Agent X.
   2. Placeholder: Follow up on key insight from Agent Y.

⏳ DELAY:
   1. Placeholder: Defer feature Z until blocker A is resolved (per Eng Agent).

❌ IGNORE:
   1. Placeholder: Ignore minor feedback point B for now (focus on goal).

💡 DELEGATE:
   1. Placeholder: Delegate task C investigation to Product Agent.

📝 Notes & Rationale:
• Placeholder: Action 1 is critical due to [reason].
• Placeholder: Conflict noted between Agent X and Agent Z reports regarding [topic].
• Placeholder: Opportunity identified in Marketing Agent report.

Confidence: 0.85
`;
  return Promise.resolve(mockDirective);
}

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
    // For now, this agent returns the raw string directive based on the prompt format
    // In the future, we might parse this string into a structured object
    const directive = await callLLM(combinedPrompt);
    return directive;
  } catch (error) {
    console.error('Error running Chief of Staff Agent:', error);
    // Return a string indicating failure
    return `Chief of Staff Agent failed: ${error instanceof Error ? error.message : String(error)}`;
  }
} 