const Joi = require("joi");

const playerSchema = Joi.object({
  playerid: Joi.number().required(),
  xp: Joi.number().required(),
  level: Joi.number().required(),
  grade: Joi.string().required(),
  aura: Joi.number().required(),
  wins: Joi.number().required(),
  loses: Joi.number().required(),
  played: Joi.number().required(),
  hoursPlayed: Joi.string().required(),
  dodge: Joi.number().required(),
  steal: Joi.number().required(),
  frozen: Joi.number().required(),
  killCount: Joi.number().required(),
  dailyStreak: Joi.number().required(),
  matchesWonWithAll3Dragon: Joi.number().required(),
  lossStreak: Joi.number().required(),
  winStreak: Joi.number().required(),
  criticalKills: Joi.number().required(),
});

module.exports = playerSchema;
