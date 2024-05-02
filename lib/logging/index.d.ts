import * as winston from 'winston';
interface LoggerOptions {
    level: string;
    colors?: boolean;
}
export declare type Logger = winston.Logger;
export declare class LoggingManager {
    private logLevel;
    private loggers;
    private enableColors;
    init(options: LoggerOptions): void;
    colorize: (level: string, message: string) => string;
    private createLogger;
    getLogger: (label: string, options?: {
        level?: string | undefined;
    } | undefined) => winston.Logger;
}
declare const _default: LoggingManager;
export default _default;
