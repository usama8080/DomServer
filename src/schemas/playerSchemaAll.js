const Joi = require("joi");

const playerSchema = Joi.object({
    xp: Joi.number().required(),
    level: Joi.number().required(),
    grade: Joi.string().required(),
    aura: Joi.number().required(),
    wins: Joi.number().required(),
    loses: Joi.number().required(),
    played: Joi.number().required(),
    hoursPlayed: Joi.number().required(),
    dodge: Joi.number().required(),
    steal: Joi.number().required(),
    frozen: Joi.number().required(),
    killCount: Joi.number().required(),
    dailyStreak: Joi.number().required(),
    matchesWonWithAll3Dragon: Joi.number().required(),
    lossStreak: Joi.string().required(),
    territories:Joi.number().required(),
    killed:Joi.number().required(),
    killedby:Joi.number().required(),




});

module.exports = playerSchema;