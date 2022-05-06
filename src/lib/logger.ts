import { format, transports } from 'winston';
import { WinstonModule } from 'nest-winston';
import { NODE_ENV } from '../config';

const customLogger = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    return `${timestamp} ${level}  - ${metadata.context} - ${message} `;
  },
);

export default WinstonModule.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.align(),
    format.colorize(),
    format.errors({ stack: true }),
    format.prettyPrint(),
    format.simple(),
    format.splat(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customLogger,
  ),
  transports: [new transports.Console()],
});
