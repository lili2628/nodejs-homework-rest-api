/* eslint-disable */
const Joi = require("joi");

const registerSchema = Joi.object({
  password: Joi.string().required().min(6),
  // eslint-disable-next-line
  email: Joi.string().min(4).max(255).required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
  subscription: Joi.string().valid('starter','pro','business'),
});

const loginSchema = Joi.object({
  password: Joi.string().required().min(6),
   // eslint-disable-next-line
  email: Joi.string().min(4).max(255).required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
});

const emailSchema = Joi.object({
  // eslint-disable-next-line
  email: Joi.string().min(4).max(255).required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
});


module.exports = {
  registerSchema,
  loginSchema,
  emailSchema,
}
