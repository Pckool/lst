export interface Task {
    _id?: string;
    id: string;
    ts: number;
    text: string;
    owner: string;
    tag: {
        title: string; 
        color: string; 
    }
} 

export interface PendingTask {
    ts?: number;
    text?: string;
    owner?: string;
    tag?: {
        title: string;
        color: string; 
    }
} 