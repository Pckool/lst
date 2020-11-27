export interface Task {
    id: string;
    ts: number;
    title: string;
} 
export interface PendingTask {
    ts?: number;
    title?: string;
} 