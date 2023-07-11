const Joi = require("joi");

const phoneRegExp = [/^([+]?[0-9\s-\(\)]{3,25})*$/i];

const addSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().min(4).max(255).required().email(),
  phone: Joi.string().required().pattern(phoneRegExp),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});


module.exports = {
    addSchema,
    updateFavoriteSchema,
}