const Joi = require('@hapi/joi');

// this file handles all validation over the server

// REGISTER VALIDATION
const registerValidation = data => {
    const schema = Joi.object({
        uname:Joi.string()
            .min(1)
            .required(),
        fname:Joi.string()
            .min(1)
            .required(),
        lname:Joi.string()
            .min(1)
            .required(),
        pword:Joi.string()
        .min(6)
        .required()
    });
    return  schema.validate(data);
}

// LOGIN VALIDATION
const loginValidation = data => {
    const schema = Joi.object({
        uname:Joi.string()
            .min(1)
            .required(),
        pword:Joi.string()
        .min(6)
        .required()
    });
    return  schema.validate(data);
}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation