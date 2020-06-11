const logger = require('../startup/logger');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
        .then((result) => {
            logger.info(`Connected to ${db}...`);
        }).catch((err) => {
            logger.error(`Error: ${err}`);
        });
};
