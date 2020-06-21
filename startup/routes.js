const express = require('express');
const pictures = require('../routes/pictures');
const galleries = require('../routes/galleries');
const me = require('../routes/me');

module.exports = function(app) {
    app.use(express.json());
    app.use('/', express.static('public'));
    app.use('/api/pictures', pictures);
    app.use('/api/galleries', galleries);
    app.use('/api/me', me);
};