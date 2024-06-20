// core/core.ts
import { Task, TaskStatus, TaskResult } from './interfaces';
import { ConsoleLogger as Logger } from './logger';
import { Scheduler } from './scheduler';

export class TaskManager {
    private tasks: Map<string, Task> = new Map();
    private taskStatuses: Map<string, TaskStatus> = new Map();
    private taskResults: Map<string, TaskResult> = new Map();
    private scheduler: Scheduler;
    private logger: Logger;

    constructor(logger: Logger) {
        this.scheduler = new Scheduler(this);
        this.logger = logger;
    }

    addTask(task: Task): void {
        this.tasks.set(task.id, task);
        this.taskStatuses.set(task.id, { id: task.id, status: 'pending' });
        this.logger.log(`Task added: ${task.name}`);
    }

    async runTask(taskId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new Error(`Task with id ${taskId} not found`);
        }

        this.taskStatuses.set(taskId, { id: taskId, status: 'in-progress' });
        this.logger.log(`Running task: ${task.name}`);

        try {
            const result = await task.execute();
            this.taskResults.set(taskId, { id: taskId, result });
            this.taskStatuses.set(taskId, { id: taskId, status: 'completed' });
        } catch (error) {
            // @ts-ignore
            this.taskStatuses.set(taskId, { id: taskId, status: 'failed', error });
        }
    }

    getTaskStatus(taskId: string): TaskStatus | undefined {
        return this.taskStatuses.get(taskId);
    }

    getTaskResult(taskId: string): TaskResult | undefined {
        return this.taskResults.get(taskId);
    }

    async runAllPendingTasks(): Promise<void> {
        await this.scheduler.schedule();
    }

    getPendingTasks(): Task[] {
        return Array.from(this.tasks.values()).filter(task => {
            const status = this.taskStatuses.get(task.id);
            return status && status.status === 'pending';
        });
    }
}