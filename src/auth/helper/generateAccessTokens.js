const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1800s'});
  }

  module.exports = generateAccessToken;

//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "50s" });
//authService.js