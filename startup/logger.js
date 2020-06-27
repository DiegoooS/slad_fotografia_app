require('express-async-errors');
const winston = require('winston');

module.exports = winston.createLogger({
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' })
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'errors.log' })
    ]
});