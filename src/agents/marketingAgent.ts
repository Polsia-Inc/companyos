import * as fs from 'fs';
import * as path from 'path';
// Add url import for ESM compatible __dirname
import * as url from 'url';
// Import the shared AgentInput type
import { AgentInput } from '../types.js';

// ESM compatible __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Placeholder for the actual LLM call function - assumed to be shared or refactored later
async function callLLM(prompt: string): Promise<string> {
  console.log('--- Mock LLM Call Start ---');
  console.log(prompt.substring(0, 200) + '...'); // Log beginning of prompt
  console.log('--- Mock LLM Call End ---');
  return Promise.resolve('Placeholder Marketing Agent Response based on prompt.');
}

// Remove local AgentInput definition
// interface AgentInput { ... }

// Use the imported AgentInput type
export async function runMarketingAgent(input: AgentInput): Promise<string> {
  // Construct path relative to current file using ESM compatible __dirname
  const promptPath = path.join(__dirname, '../../prompts/marketingPrompt.txt');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // Adjust how pulse data is accessed based on the imported AgentInput type
  const combinedPrompt = `
${promptTemplate}

# Current Context:
## Pulse:
${JSON.stringify(input.currentPulse, null, 2)} // Use input.currentPulse directly or specific fields

## Other Agent Reports:
${JSON.stringify(input.otherAgentReports || {}, null, 2)}

# Marketing Agent Analysis:
`;

  try {
    const response = await callLLM(combinedPrompt);
    return response;
  } catch (error) {
    console.error('Error running Marketing Agent:', error);
    throw error;
  }
} 