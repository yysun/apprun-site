import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return timestamp
    ? `${timestamp} [${level}] ${message}`
    : `[${level}] ${message}`;  // Omit timestamp if not present
});

// Create the Winston logger instance
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Default log level
  format: process.env.NODE_ENV !== 'production'
    ? combine(
      colorize(),               // Add colors in development
      logFormat                 // No timestamp in development
    )
    : combine(
      timestamp(),              // Add timestamp in production
      logFormat                 // Include timestamp in production
    ),
  transports: [
    new transports.Console()
  ]
});

/**
 * Log a message with the given action, subject, result, and log level.
 *
 * @param {string} logLevel - The log level ('info', 'warn', 'error', 'debug').
 * @param {string} action - The action that took place.
 * @param {string} subject - The subject of the action (e.g., user, service).
 * @param {string} result - The result or outcome of the action.
 */
function logAction(logLevel, action, subject, result) {
  const message = `${action} ${subject} ${result ?? ''}`;

  // Log based on the provided log level
  if (logger[logLevel]) {
    logger[logLevel](message);
  } else {
    logger.info(message); // Default to 'info' level if logLevel is invalid
  }
}

const info = (...p) => logAction('info', ...p);
const debug = (...p) => logAction('debug', ...p);
const warn = (...p) => logAction('warn', ...p);
const error = (...p) => logAction('error', ...p);

export { info, debug, warn, error };