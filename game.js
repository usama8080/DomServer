// Dotenv handy for local config & debugging
require("dotenv").config();

// Core Express & logging stuff
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const errorHandler = require("./src/middleware/error-handler");
const { sequelize } = require("./models");

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();

const path = require("path");
//cors
const cors = require("cors");
const helmet = require("helmet");

/**
 * @swagger
 * components:
 *   schemas:
 *     Killed:
 *       type: object
 *       properties:
 *          UserId:
 *            type: integer
 *          count:
 *            type: integer
 */

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    // servers: [
    //   {
    //     url: "https://dragonofmidgardsgame.herokuapp.com/",
    //   },
    // ],
  },
  apis: ["./src/routes/*.js"],
};
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// Logging
app.use(logger("dev"));

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  //    next();

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  //Pass to next layer of middleware
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});
//wearing a helmet

app.use(helmet());
// Parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));

// Routes & controllers
app.get("/", (req, res) =>
  res.json({ msg: " Welcome to Dragon of midgards  Game Apis" })
);
app.use("/api/user", require("./src/routes/user-route"));
app.use("/api/nft", require("./src/routes/nftRoute"));
app.use("/api/player", require("./src/routes/playerRoute"));
app.use("/api/achievements", require("./src/routes/achievementsRoute"));
app.use("/api/skills", require("./src/routes/skillRoute"));

// app.use("/admin", require("./src/routes/admin"));

// Catch all route, generate an error & forward to error handler
app.use(function (req, res, next) {
  let err = new Error(
    "Wrong Api hit :, checked the doucmentation and hit again"
  );
  err.status = 404;
  next(err);
});

app.use(errorHandler);

// app.use((err, req, res, next) => {
//   //res.status(err.status || 500);
//   res.status(err.status || 500).send({message: err.message})
//   next(err);
// });
// Get values from env vars or defaults where not provided


let port = 2003;

// Start the server
app.listen(port, async () => {
  console.log(`Server Started on port ${port}`);
  await sequelize.authenticate();
  // console.log(__dirname)
 0 //await sequelize.sync({ force: true, alter: true });
  console.log("DB connected");
});

module.exports = app;

// User1

// {
//   "email": "muhammadtaimoor049@gmail.com",
//   "username":"user1",
//   "password":"abcd1234Q@",
//   "confirmpassword":"abcd1234Q@",
//   "walletaddress": "0xca431ceEf3Fca0E4Ab118F36D4aadd57050E97c9"

// }

// User 2

// {
//   "email": "taimoornoman@gmail.com",
//   "username":"user2",
//   "password":"abcd12343Q@",
//   "confirmpassword":"abcd12343Q@",
//   "walletaddress": "0xCD7260635caBB0975FADbbC2865a487ff62da093"

// }
