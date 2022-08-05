const model = require("../../models/index");
const jwt = require("jsonwebtoken");
async function authenticateToken(req, res, next) {
  console.log("middleWare  ????????");
  // console.log("ID :  : ", req.body.id);
  // let findTemp = await model.User.findByPk(req.body.id);
  // console.log("temp calll : : : ", findTemp);
  // const token = findTemp.Token;
  // console.log("temp calll : : : ", token);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Tokens:", token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //console.log("Error",err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });

  console.log("middleWare  END  ??????");
}
module.exports = authenticateToken;
