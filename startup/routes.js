const express = require('express');
const pictures = require('../routes/pictures');
const galleries = require('../routes/galleries');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/pictures', pictures);
    app.use('/api/galleries', galleries);
};