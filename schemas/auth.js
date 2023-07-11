const Joi = require("joi");

const emailRegexp = ^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$;

const registerSchema = Joi.object({
  email: Joi.string().min(4).max(255).required().pattern(emailRegexp),
  password: Joi.string().required().min(6),
  subscription: Joi.string().valid('starter','pro','business'),
});

const loginSchema = Joi.object({
  email: Joi.string().min(4).max(255).required().pattern(emailRegexp),
  password: Joi.string().required().min(6),
});


module.exports = {
    registerSchema,
    loginSchema,
}
