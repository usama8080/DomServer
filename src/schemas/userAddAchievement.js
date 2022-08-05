const Joi = require("joi");

const UserAddAchievement = Joi.object({
  // UserId: Joi.number().required(),
  achievementsId: Joi.number().required(),
  BattleStatId: Joi.number().required(),
});

module.exports = UserAddAchievement;
