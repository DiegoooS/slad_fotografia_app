
const config = require('config');
const sgMail =require('@sendgrid/mail');
const { validate } = require('../models/mail');
const express = require('express');
const router = express.Router();

router.post('/', async(req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    sgMail.setApiKey(config.get('SENDGRID_API_KEY'));

    const message = {
        to: 'blackwarg21@gmail.com',
        from: `sladwebsitemailer@gmail.com`,
        subject: `Email from ${req.body.name} sended via website`,
        text: `From: ${req.body.email} : ${req.body.text}`,
    };

    try {
        const mail = await sgMail.send(message);
        return res.send('Email sended');
    }
    catch(err) {
        return res.status(400).send('Something went wrong');
    }
});

module.exports = router;
