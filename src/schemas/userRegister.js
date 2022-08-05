const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");


const userregsister = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password:  new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4
      }),
      walletaddress: Joi.string().required(),
      confirmpassword:Joi.string().required().valid(Joi.ref('password'))
        // confirmpassword:Joi.any.valid(Joi.ref('password')).options({
        //     language: {
        //        any: {
        //           allowOnly: 'passwords don\'t match'
        //        }
        //     }
        //  }),
     // top: Joi.string().required(),
    // type: Joi.string().required(),

});

module.exports = userregsister;



