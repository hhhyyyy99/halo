import { TaskManager } from './core';

export class Scheduler {
    private taskManager: TaskManager;

    constructor(taskManager: TaskManager) {
        this.taskManager = taskManager;
    }

    async schedule(): Promise<void> {
        const tasks = this.taskManager.getPendingTasks();
        for (const task of tasks) {
            await this.taskManager.runTask(task.id);
        }
    }
}