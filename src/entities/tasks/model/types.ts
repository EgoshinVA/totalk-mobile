export type TaskStatus = 'pending' | 'done' | 'canceled';

export interface Task {
    id: number;
    userId: number;
    title: string;
    description?: string;
    rawText?: string;
    scheduledAt?: string | null; // ISO date string
    isRecurring: boolean;
    recurringRule?: string;
    recurringEnd?: string | null;
    status: TaskStatus;
    completedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type TaskFilter = 'all' | 'pending' | 'done' | 'canceled';