import pino from "pino";
import env from "./env.js";

export const logger = pino({
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: {
        paths: [
            'req.headers.authorization', 
            'req.body.password',
            'req.body.token',
            '*.password',

        ],
        censor: '[REDACTED]'
    },
    transport: env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    } : undefined
})

export default logger;