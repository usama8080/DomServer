const Joi = require("joi");

const claimAchievement = Joi.object({
  // UserId: Joi.number().required(),
  achievementsId: Joi.number().required(),
  claim: Joi.bool().required(),
});

module.exports = claimAchievement;
