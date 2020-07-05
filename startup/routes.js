const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const pictures = require('../routes/pictures');
const galleries = require('../routes/galleries');
const me = require('../routes/me');
const mails = require('../routes/mails');

module.exports = function(app) {
    app.use(express.json());
    app.use('/', express.static('public'));
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/pictures', pictures);
    app.use('/api/galleries', galleries);
    app.use('/api/me', me);
    app.use('/api/mail', mails);
};