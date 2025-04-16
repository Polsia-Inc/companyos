export type Context = {
    date: string;
    goal: string;
    blockers: string[];
    user_feedback: string[];
    energy_level: string;
    emotional_state: string;
};

// Represents the structured response previously returned by agents
export type AgentStructuredResponse = {
    agent: string;
    recommendations: string[];
    concerns?: string[];
    flags?: string[];
    confidence?: number;
};

// Types for the new interactive flow (v0.2.5)
export type AgentBrief = string; // The initial 1-3 sentence message from the agent
export type UserResponse = string; // The user's text reply to the agent
export type AgentReply = string; // The agent's single follow-up reply

// Stores the full conversation history for one agent interaction
export type AgentInteraction = {
    agentName: string;
    brief: AgentBrief;
    userResponse?: UserResponse; // Optional because the user might not respond
    agentReply?: AgentReply;     // Optional for the same reason
    skipped: boolean;
};


// Input for generating the *initial* brief
export type AgentBriefInput = {
    currentPulse: Context;
    pulseHistory?: Context[]; // Array of past Context objects
    companyDocs?: { summary: string; /* other fields as needed */ };
    companyMemo?: object; // Add the parsed company memo JSON object
};

// Input for generating the *follow-up* reply
// Might need more context depending on agent implementation
export type AgentReplyInput = {
    currentPulse: Context;
    pulseHistory?: Context[];
    companyDocs?: { summary: string };
    companyMemo?: object;
    initialBrief: AgentBrief;
    userResponse: UserResponse;
};

// --- Deprecated / To be refactored --- 
// Old AgentResponse type, keep temporarily if needed during refactor, rename to avoid conflict
// export type AgentResponse = AgentStructuredResponse;

// Old AgentInput, keep temporarily if needed during refactor, rename to avoid conflict
export type AgentInput_v0_2 = {
    currentPulse: Context;
    pulseHistory?: Context[];
    companyDocs?: { summary: string };
    otherAgentReports?: { [key: string]: string | AgentStructuredResponse }; // Uses the renamed structured response
    companyMemo?: object;
};
