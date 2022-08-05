const Joi = require("joi");
//const models=
const battleschema = Joi.object({
  // UserId: Joi.number().required()
  type: Joi.number().valid("one", "three").required(),
  normalAttacks: Joi.number().required(),
  specialAttacks: Joi.number().required(),
  criticalAttacks: Joi.number().required(),
  //dragon: Joi.array().min(1).max(3).required(),
  dragon: Joi.array().when("type", [
    { is: "one", then: Joi.array().min(1).max(1).required() },
    { is: "three", then: Joi.array().min(3).max(3).required() },
  ]),
  //skills: Joi.array().items(Joi.number()).min(1),
  skills: Joi.array().items({
    id: Joi.number().required(),
    count: Joi.number().required(),
  }),
  achievements: Joi.array().items(Joi.number()),

  // dragon1: Joi.number().required(),
  // dragon2: Joi.number().required(),
  // dragon3: Joi.number().required(),
});

module.exports = battleschema;
// let Joi = require("joi");
// let service = Joi.object().keys({
//   serviceName: Joi.string().required(),
// });

// let services = Joi.array().items(service);

// let test = Joi.validate(
//   [{ serviceName: "service1" }, { serviceName: "service2" }],
//   services
// );
