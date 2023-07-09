const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().min(4).max(255).required().email(),
  phone: Joi.string().required().pattern(/^([+]?[0-9\s-\(\)]{3,25})*$/i),
});


module.exports = {
    addSchema,
}