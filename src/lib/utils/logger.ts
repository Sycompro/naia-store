type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function formatLog(entry: LogEntry): string {
  const { timestamp, level, message, context, data } = entry;
  let log = `[${timestamp}] ${level.toUpperCase()}${context ? ` [${context}]` : ''}: ${message}`;
  
  if (data !== undefined) {
    if (CURRENT_LEVEL === 'debug') {
      log += `\n  Data: ${JSON.stringify(data, null, 2)}`;
    } else {
      log += ` ${JSON.stringify(data)}`;
    }
  }
  
  return log;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL];
}

function createLogger(context?: string) {
  return {
    debug(message: string, data?: unknown) {
      if (!shouldLog('debug')) return;
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        context,
        data,
      };
      console.log(formatLog(entry));
    },
    
    info(message: string, data?: unknown) {
      if (!shouldLog('info')) return;
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'info',
        message,
        context,
        data,
      };
      console.log(formatLog(entry));
    },
    
    warn(message: string, data?: unknown) {
      if (!shouldLog('warn')) return;
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'warn',
        message,
        context,
        data,
      };
      console.warn(formatLog(entry));
    },
    
    error(message: string, error?: unknown) {
      if (!shouldLog('error')) return;
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'error',
        message,
        context,
        data: error instanceof Error 
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
      };
      console.error(formatLog(entry));
    },
  };
}

export const logger = createLogger('app');

export function createContextLogger(context: string) {
  return createLogger(context);
}

export function logRequest(method: string, path: string, status?: number, duration?: number) {
  logger.info(`${method} ${path}`, { status, duration: `${duration}ms` });
}

export function logApiError(endpoint: string, error: unknown) {
  logger.error(`API Error in ${endpoint}`, error);
}