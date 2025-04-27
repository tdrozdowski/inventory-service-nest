import { Injectable, LoggerService as NestLoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;
  private enabled: boolean;
  private logLevel: LogLevel;

  constructor(private readonly configService: ConfigService) {
    const telemetryConfig = this.configService.get('telemetry');
    this.enabled = telemetryConfig.enabled && telemetryConfig.logging.enabled;
    this.logLevel = this.parseLogLevel(telemetryConfig.logging.level || 'info');
  }

  setContext(context: string): this {
    this.context = context;
    return this;
  }

  log(message: any, context?: string): void {
    if (!this.isLevelEnabled('log')) {
      return;
    }
    this.printMessage('log', message, context || this.context);
  }

  error(message: any, trace?: string, context?: string): void {
    if (!this.isLevelEnabled('error')) {
      return;
    }
    this.printMessage('error', message, context || this.context, trace);
  }

  warn(message: any, context?: string): void {
    if (!this.isLevelEnabled('warn')) {
      return;
    }
    this.printMessage('warn', message, context || this.context);
  }

  debug(message: any, context?: string): void {
    if (!this.isLevelEnabled('debug')) {
      return;
    }
    this.printMessage('debug', message, context || this.context);
  }

  verbose(message: any, context?: string): void {
    if (!this.isLevelEnabled('verbose')) {
      return;
    }
    this.printMessage('verbose', message, context || this.context);
  }

  private printMessage(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    if (!this.enabled) {
      // If OpenTelemetry logging is disabled, use console
      this.consoleLog(level, message, context, trace);
      return;
    }

    // Format the log message
    const formattedMessage = this.formatMessage(level, message, context);

    // Add trace information if available
    const logData: Record<string, any> = {
      level,
      message: formattedMessage,
      timestamp: new Date().toISOString(),
    };

    if (context) {
      logData.context = context;
    }

    if (trace) {
      logData.trace = trace;
    }

    // Log to console for local development
    this.consoleLog(level, message, context, trace);

    // In a production environment, the OpenTelemetry SDK will automatically
    // collect logs from the console and send them to the configured endpoint
  }

  private formatMessage(level: LogLevel, message: any, context?: string): string {
    return context ? `[${context}] ${message}` : message;
  }

  private consoleLog(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case 'log':
        console.log(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        if (trace) {
          console.error(trace);
        }
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'verbose':
        console.log(formattedMessage);
        break;
    }
  }

  private parseLogLevel(level: string): LogLevel {
    const levels: Record<string, LogLevel> = {
      error: 'error',
      warn: 'warn',
      log: 'log',
      info: 'log',
      debug: 'debug',
      verbose: 'verbose',
    };

    return levels[level.toLowerCase()] || 'log';
  }

  private isLevelEnabled(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const targetLevelIndex = levels.indexOf(level);

    return targetLevelIndex <= currentLevelIndex;
  }
}
