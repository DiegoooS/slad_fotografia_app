
const Joi = require('@hapi/joi');

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(50).required().email(),
        text: Joi.string().min(5).max(300).required()
    });

    return schema.validate(user);
}

module.exports.validate = validateUser;