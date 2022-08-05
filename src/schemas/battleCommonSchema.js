const Joi = require("joi");

const battleCommonschema = Joi.object({
  duration: Joi.number().required(),
  territory: Joi.number().required(),
  win: Joi.number().required(),
  loose: Joi.number().required(),
});

module.exports = battleCommonschema;
