export type Context = {
    date: string;
    goal: string;
    blockers: string[];
    user_feedback: string[];
    energy_level: string;
    emotional_state: string;
};

export type AgentResponse = {
    agent: string;
    recommendations: string[];
    concerns?: string[];
    flags?: string[];
    confidence?: number;
};

// Refined input type for agents, potentially including history and company docs
export type AgentInput = {
    currentPulse: Context;
    pulseHistory?: Context[]; // Array of past Context objects
    companyDocs?: { summary: string; /* other fields as needed */ };
    otherAgentReports?: { [key: string]: string | AgentResponse }; // Add outputs from previous agents
    companyMemo?: object; // Add the parsed company memo JSON object
};
