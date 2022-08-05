const Joi = require("joi");

const killedSchema = Joi.object({
  // UserId: Joi.number().required(),
  killedid: Joi.number().required(),
});

module.exports = killedSchema;
