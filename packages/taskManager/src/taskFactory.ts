// taskFactory.ts
import { Task, SimpleTaskConfig, TimedTaskConfig, ConditionalTaskConfig } from './interfaces';

export class TaskFactory {
    static createSimpleTask(config: SimpleTaskConfig): Task {
        return {
            id: config.id,
            name: config.name,
            execute: () => new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.2) {
                        resolve();
                    } else {
                        reject(new Error('Random failure in simple task'));
                    }
                }, config.delay);
            }),
        };
    }

    static createTimedTask(config: TimedTaskConfig): Task {
        return {
            id: config.id,
            name: config.name,
            execute: () => new Promise<void>((resolve, reject) => {
                const now = Date.now();
                if (config.executionTime <= now) {
                    if (Math.random() > 0.2) {
                        resolve();
                    } else {
                        reject(new Error('Random failure in timed task'));
                    }
                } else {
                    reject(new Error('Execution time has not reached'));
                }
            }),
        };
    }

    static createConditionalTask(config: ConditionalTaskConfig): Task {
        return {
            id: config.id,
            name: config.name,
            execute: () => new Promise<void>((resolve, reject) => {
                if (config.condition()) {
                    if (Math.random() > 0.2) {
                        resolve();
                    } else {
                        reject(new Error('Random failure in conditional task'));
                    }
                } else {
                    reject(new Error('Condition not met'));
                }
            }),
        };
    }
}