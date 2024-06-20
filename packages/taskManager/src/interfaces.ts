// interfaces.ts
export interface Task {
    id: string;
    name: string;
    execute: () => Promise<void>;
}

export interface TaskStatus {
    id: string;
    status: "pending" | "in-progress" | "completed" | "failed";
    error?: Error;
}

export interface TaskResult {
    id: string;
    result: any;
}

export interface Logger {
    log: (message: string) => void;
    error: (message: string) => void;
}

export interface SimpleTaskConfig {
    id: string;
    name: string;
    delay: number;
}

export interface TimedTaskConfig {
    id: string;
    name: string;
    executionTime: number; // Unix timestamp
}

export interface ConditionalTaskConfig {
    id: string;
    name: string;
    condition: () => boolean;
}