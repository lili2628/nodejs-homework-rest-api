const Joi = require("joi");



const registerSchema = Joi.object({
  email: Joi.string().min(4).max(255).required(),
    // .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
  password: Joi.string().required().min(6),
  subscription: Joi.string().valid('starter','pro','business'),
});

const loginSchema = Joi.object({
  email: Joi.string().min(4).max(255).required(),
    // .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
  password: Joi.string().required().min(6),
});


module.exports = {
    registerSchema,
    loginSchema,
}
