// logger.ts
import { Logger } from './interfaces';

export class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }

    error(message: string): void {
        console.error(message);
    }
}