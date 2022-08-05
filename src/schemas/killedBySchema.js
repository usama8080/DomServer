const Joi = require("joi");

const killedBySchema = Joi.object({
  // UserId: Joi.number().required(),

  killedbyid: Joi.number().required(),
});

module.exports = killedBySchema;
