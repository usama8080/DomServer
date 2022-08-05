const Joi = require("joi");

const UsedSkiils = Joi.object({
  // UserId: Joi.number().required(),
  count: Joi.number().required(),
  skillid: Joi.number().required(),
});

module.exports = UsedSkiils;
