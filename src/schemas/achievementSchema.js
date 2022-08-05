const Joi = require("joi");

const achievementSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    xp: Joi.number().required(),
    aura:Joi.number().required(),
    amount:Joi.string().required(),
    typeOfAchievements:Joi.string().required(),
    

});

module.exports = achievementSchema;