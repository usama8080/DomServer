require("dotenv").config();
const model = require("../../models");
const crypto = require("crypto");
const registerSchema = require("../schemas/userRegister");
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const smtpPool = require("nodemailer-smtp-pool");
const generateAccessToken = require("../auth/helper/generateAccessTokens");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Web3 = require("web3");
const authServices = require("../auth/helper/authService");
const emailValidator = require("email-validator");
const multer = require("multer");
const abi = require("../../abi/abi.json");
var web3 = new Web3(process.env.INFURA_URL);
const ct = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

module.exports = {
  registerUserController: async (req, res, next) => {
    try {
      const body = await registerSchema.validateAsync(req.body);
      let { username, email, password, walletaddress, confirmpassword } = body;
      email = email.toLowerCase();
      username = username.toLowerCase();
      var host = req.get("host");
      //return res.json(origin);
      if (!web3.utils.isAddress(walletaddress)) {
        // let err = new Error("NotFoundError");
        // err.messageValue = "Not found 404";
        // throw err;
        // // throw new Error("NotFoundError");
        res.status(400).send({
          data: null,
          error: "Invalid Address",
          success: false,
        });
      }

      const dbUsers = await model.User.findOne({
        where: {
          email: email,
        },
      });
      let checkwallet = await model.User.findOne({
        where: {
          walletaddress: walletaddress,
        },
      });
      if (checkwallet) {
        // throw new Error(
        //   "You are already registered with this WalletAddress. Try to login into the site."
        // );
        // res.status(500).send('you are already registered with this email. Try to login into the site')
        res.status(400).send({
          data: null,
          error:
            "You are already registered with this WalletAddress. Try to login into the site",
          success: false,
        });
      }
      if (dbUsers) {
        // throw new Error(
        //   "You are already registered with this email. Try to login into the site."
        // );
        res.status(400).send({
          data: null,
          error:
            "You are already registered with this email. Try to login into the site",
          success: false,
        });
        // res.status(500).send('you are already registered with this email. Try to login into the site')
      }
      const isUser = await model.User.findOne({
        where: {
          username,
        },
      });
      if (isUser) {
        res.status(400).send({
          data: null,
          error: "User name already Exist",
          success: false,
        });
        // throw new Error("User name already Exist");
        // res.status(500).send('you are already registered with this email. Try to login into the site')
      }

      const randomTokenString = async () => {
        return crypto.randomBytes(40).toString("hex");
      };
      const hashPassword = await bcrypt.hash(password, 10);
      const random = await randomTokenString();

      const user = await model.User.create({
        email,
        password: hashPassword,
        emailVerified: false,
        verificationToken: random,
        username,
        walletaddress,
      });
      if (user) {
        let verificationlink = await authServices.sendVerificationEmail(
          user,
          host
        );
        if (verificationlink)
          res.json({
            data: ` Signup successfull and verification email is send to your mail `,
            error: null,
            success: true,
          });
      }
    } catch (error) {
      next(error);
    }
  },
  verificationEmail: async (req, res, next) => {
    let token = req.query.token;

    const veirfy = await authServices.verifyEmail(token);
    if (veirfy) {
      return res.json({
        data: "verify Successfully  ",
        error: null,
        success: true,
      });
    }
    res.sendStatus(200);
  },
  loginUserController: async (req, res, next) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();
      const dbUser = await model.User.findOne({
        where: {
          email: email,
        },
        include: [
          {
            model: model.UnlockedAcheievements,
            include: [
              {
                model: model.Achievements,
              },
            ],
            // include: [
            //   modelUser
            // ]
          },
          model.PlayerStat,
          // model.KilledBy,
          // model.Killed,

          {
            model: model.KilledBy,
            attributes: ["count", "killedbyid"],
          },
          {
            model: model.Killed,
            attributes: ["count", "killedid"],
          },
          {
            model: model.SkillUsed,
            attributes: ["skillId", "count"],
          },
        ],
      });

      if (!dbUser) {
        //throw new Error("Email is not registered with us.");
        res.status(400).send({
          data: null,
          error: "Email is not registered with us",
          success: false,
        });
      }

      const compare = await bcrypt.compareSync(password, dbUser.password);
      if (!compare) {
        //throw new Error("Password doesn't match");
        res.status(400).send({
          data: null,
          error: "Password doesn't match",
          success: false,
        });
      }
      //  return res.json("User exist")
      let user = { name: dbUser.username, id: dbUser.id };
      let accessToken = generateAccessToken(user);
      let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      let updateTokens = await model.User.update(
        {
          refreshToken,
        },
        { where: { email } }
      );

      if (updateTokens) {
        const userdragons = await ct.methods
          .tokensOfOwner(dbUser.walletaddress)
          .call();

        //Object.assign(dbUser.totaldragon , { first: 'blah', last: 'ha'});
        //dbUser.totaldragon=userdragons.length;
        let dragons = [];
        //dragons.push(userdragons.length);
        for (let dragon of userdragons) {
          let dragonid = parseInt(dragon);
          let isdragon = await model.Dragons.findOne({
            where: { dragonid },
          });

          let dragon_skills = await model.Skill.findAll({
            where: { dragonClass: isdragon.dragon },
          });
          // removing spaces in the skills name
          for (skillname of dragon_skills) {
            let newskillname = skillname.skillName.split(" ");

            skillname.skillName = newskillname.reduce(function (a, b) {
              return a + b;
            });
          }
          // dragon_skills[0].skillName="hello";
          // return res.json(dragon_skills)
          let dragonAndSkills = {
            dragonid: isdragon.dragonid,
            description: isdragon.description,
            name: isdragon.name,
            image: isdragon.image,
            ankle: isdragon.ankle,
            dragon: isdragon.dragon,
            bracelet: isdragon.bracelet,
            eyes: isdragon.eyes,
            head: isdragon.head,
            horns: isdragon.horns,
            necklace: isdragon.necklace,
            shoulder: isdragon.shoulder,
            tail: isdragon.tail,
            tailends: isdragon.tailends,
            teeth: isdragon.teeth,
            wings: isdragon.wings,
            background: isdragon.background,
            class: isdragon.class,
            category: isdragon.category,
            ankleDmg: isdragon.ankleDmg,
            hp: isdragon.hp,
            braceletDmg: isdragon.braceletDmg,
            eyeDmg: isdragon.eyeDmg,
            tailDmg: isdragon.tailDmg,
            headDmg: isdragon.headDmg,
            hornsDmg: isdragon.hornsDmg,
            necklaceDmg: isdragon.necklaceDmg,
            shoulderDmg: isdragon.shoulderDmg,
            tailDmg: isdragon.tailDmg,
            tailendsDef: isdragon.tailendsDef,
            teethDmg: isdragon.teethDmg,
            wingsDef: isdragon.wingsDef,
            specialAttack: isdragon.specialAttack,
            damage: isdragon.damage,
            defence: isdragon.defence,
            totalSkills: dragon_skills.length,
            Skills: dragon_skills,
          };
          dragons.push(dragonAndSkills);
        }
        res
          .json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            User: dbUser,
            totalDragons: userdragons.length,
            Dragons: dragons,
            success: true,
            error: null,
          })
          .status(200);
      } else {
        res
          .json({
            msg: "Error in refresh tokens ",
          })
          .status(403);
      }
    } catch (error) {
      next(error);
      //res.status(500).send({message:'Something went wrong'})
    }
  },
  refreshTokens: async (req, res, next) => {
    // const email = req.body.Email;
    // let findTemp = await queryAuth5.findOne({ where: { Email: email } });
    // const refreshToken = findTemp.RefreshToken;

    // if (refreshToken == null) return res.sendStatus(401);
    // // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    // jwt.verify(
    //   refreshToken,
    //   process.env.REFRESH_TOKEN_SECRET,
    //   async (err, user) => {
    //     if (err) return res.sendStatus(403);
    //     const accessToken = generateAccessToken({ name: email });
    //     await queryAuth5.update(
    //       { accessToken: accessToken },
    //       { where: { Email: email } }
    //     );
    //     res.json({ accessToken: accessToken });
    //   }
    // );
    try {
      let refreshToken = req.body.token;
      if (refreshToken == null) return res.sendStatus(401);
      let checkrefreshToken = await model.User.findOne({
        where: { refreshToken },
      });
      if (!checkrefreshToken) return res.sendStatus(403);
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) return res.sendStatus(403);

          let accessToken = generateAccessToken({
            id: user.id,
            name: user.username,
          });
          await model.User.update({ refreshToken }, { where: { id: user.id } });
          res.json({ accessToken: accessToken });
        }
      );
    } catch (error) {
      next(error);
    }
  },
  refreshTokens: async (req, res, next) => {
    try {
      var username = req.body.username;
      username = username.toLowerCase();
      const dbUsers = await model.User.findOne({
        where: {
          username,
        },
      });
      if (dbUsers) {
        res.status(400).send({
          data: null,
          error: "User name already Exist",
          success: false,
        });
        // res.status(500).send('you are already registered with this email. Try to login into the site')
      }
    } catch (error) {
      next(error);
    }
  },
  forgotPasswordController: async (req, res, next) => {
    try {
      var email = req.body.email;
      email = email.toLowerCase();
      if (emailValidator.validate(email)) {
        const checker = await authServices.sendVerificationEmailForgetPassword(
          email,
          process.env.origin
        );

        if (!checker) {
          // throw new Error("Email is not registered ");
          res.status(400).send({
            data: null,
            error: "Email is not registered",
            success: false,
          });
        } else {
          res.json({
            message: "Please check your email for password reset instructions",
          });
        }
      } else {
        res.send(" Invalid Email ");
      }
    } catch (error) {
      next(error);
    }
  },
  resetPasswordController: async (req, res, next) => {
    try {
      var email = req.body.email;
      email = email.toLowerCase();
      const dbUser = await db.User.findOne({
        where: {
          email: req.query.email,
        },
      });
      if (!dbUser) {
        res.status(400).send({
          data: null,
          error: "email is not registered with us",
          success: false,
        });
        //throw new Error("email is not registered with us");
      }
      await authServices
        .resetPassword(req.body)
        .then(() =>
          res.json({ message: "Password reset successful, you can now login" })
        )
        .catch(next);
    } catch (error) {}
  },
  // require("./fi");
  userimgcontroller: async (req, res, next) => {
    const date = new Date();
    const name = date.getTime();
    const userId = 1;
    const user = await model.User.findByPk(userId);
    if (JSON.stringify(user.profileImg) === "null") {
      const filetStoreageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./public/profiles");
        },
        filename: (req, file, cb) => {
          cb(null, `${name}.png`);
        },
      });
      const upload = multer({ storage: filetStoreageEngine }).single("files");
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          let imageurl = `${process.env.origin}/profiles/${name}.png`;
          await model.User.update(
            { profileImg: imageurl },
            { where: { id: userId } }
          );
          console.log("Image Ends\n\n");
          return res.status(200).json({
            imgPath: `${process.env.origin}/profiles/${name}.png`,
          });
        }
      });
    } else {
      const filetStoreageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./public/profiles");
        },
        filename: (req, file, cb) => {
          cb(null, `${user.profileImg}.png`);
        },
      });
      const upload = multer({ storage: filetStoreageEngine }).single("files");
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          return res.status(200).json({
            imgPath: `${process.env.origin}}/profiles/${user.profileImg}.png`,
          });
        }
      });
    }

    res.status(200);
    //   const checker = await authService.userImgUpload();
    //   if (checker) {
    //     res.json({ msg: "completed" }).status(200);
    //   } else {
    //     res.json({ msg: "your mail is not registered" }).status(201);
    //   }
  },
  verifyEmailForgetPassword: async (req, res, next) => {
    try {
      const checker = await authServices.verfiyEmailForgetPassword(
        req.query.resetToken
      );
      if (checker) {
        res.json({ msg: "mail verified" }).status(200);
      } else {
        res.json({ msg: "Your Mail is Already Verified" }).status(201);
      }
    } catch (error) {
      next(error);
    }
  },
};

// loginUserController : async (req, res, next) => {
//   try {

//     const { email, password } = req.body;
//     const dbUser = await model.User.findOne({
//       where: {
//         email: email,
//       },
//       //include: modelAchievements,
//       include: [
//         {
//           model: modelAchievements,
//           // include: [
//           //   modelUser
//           // ]
//         },
//         modelPlayerStats,
//         modelKilledBy,
//         modelKilled,
//       ],

//      // include:{modelPlayer,},
//       //include: modelKilledBy,
//       // include: modelPlayer,
//       // include: modelPlayer,

//     });

//     if (!dbUser) {
//       throw new Error("Email is not registered with us.");
//     }
//     //console.log("db user: ",dbUser)
//     const compare = await bcrypt.compareSync(password, dbUser.password);

//     if (!compare) {
//       throw new Error("Password doesn't match");
//     }

//       //return res.json("Login Successfull").status(200);

//    console.log("login Sccuess")
//    return res.json(dbUser);

//     if(dbUser.username=="user1")
//     {
//       const dragon=await modelNFT.findAll({
//         where: {
//           id: {

//             [Op.between]: [1, 10],     // BETWEEN 6 AND 10

//           },
//         }})

//   let outobj=[]
//   for(let onedragon of dragon)
//   {
//     let dragonskills=await modelSkill.findAll({
//       where:{
//         dragon_class:onedragon.class
//       }
//     })
//     //console.log("Skills",dragonskills)

//     let data={
//       id : onedragon.id,
//      dragonid: onedragon.dragonid,
//       blockchain: onedragon.blockchain,
//       description: onedragon.description,
//       name: onedragon.name,
//       image: onedragon.image,
//       background: onedragon.background,
//       wings: onedragon.wings,
//       body: onedragon.body,
//       bodyscales: onedragon.bodyscales,
//       tail: onedragon.tail,
//       ears: onedragon.ears,
//       eyes: onedragon.eyes,
//       mouth: onedragon.mouth,
//       horns: onedragon.horns,
//       headpiece: onedragon.headpiece,
//       territory: onedragon.territory,
//       class:onedragon.class,
//       cardno:Object.keys(dragonskills).length,
//       cards: dragonskills,
//       attacktype: onedragon.attacktype,

//       earsIntel: onedragon.earsIntel,
//       eyesIntel: onedragon.eyesIntel,
//       headPieceIntel: onedragon.headPieceIntel,
//       hornsDmg: onedragon.hornsDmg,
//       mouthDmg: onedragon.mouthDmg,
//       scaleDef: onedragon.scaleDef,
//       wingsDmg: onedragon.wingsDmg,
//       tailDmg: onedragon.tailDmg,
//       hp: onedragon.hp,
//       damage: onedragon.damage,
//       defence: onedragon.defence,
//       intelligence: onedragon.intelligence,
//       classifcation: onedragon.classifcation,

//     }
//     outobj.push(data)
//   }

//   if(dragon)
//   {
//     return res.json({
//       dragons:outobj,
//       total:Object.keys(outobj).length,
//       error: null,
//       success: true,
//     });
//   }
//     }
//     if(dbUser.username=="user2")
//     {
//       const dragon=await modelNFT.findAll({
//         where: {
//           id: {

//             [Op.between]: [11, 20],     // BETWEEN 6 AND 10

//           },
//         }})

//   let outobj=[]
//   for(let onedragon of dragon)
//   {
//     let dragonskills=await modelSkill.findAll({
//       where:{
//         dragon_class:onedragon.class
//       }
//     })
//     //console.log("Skills",dragonskills)

//     let data={
//       id : onedragon.id,
//      dragonid: onedragon.dragonid,
//       blockchain: onedragon.blockchain,
//       description: onedragon.description,
//       name: onedragon.name,
//       image: onedragon.image,
//       background: onedragon.background,
//       wings: onedragon.wings,
//       body: onedragon.body,
//       bodyscales: onedragon.bodyscales,
//       tail: onedragon.tail,
//       ears: onedragon.ears,
//       eyes: onedragon.eyes,
//       mouth: onedragon.mouth,
//       horns: onedragon.horns,
//       headpiece: onedragon.headpiece,
//       territory: onedragon.territory,
//       class:onedragon.class,
//       cardno:Object.keys(dragonskills).length,
//       cards: dragonskills,
//       attacktype: onedragon.attacktype,

//       earsIntel: onedragon.earsIntel,
//       eyesIntel: onedragon.eyesIntel,
//       headPieceIntel: onedragon.headPieceIntel,
//       hornsDmg: onedragon.hornsDmg,
//       mouthDmg: onedragon.mouthDmg,
//       scaleDef: onedragon.scaleDef,
//       wingsDmg: onedragon.wingsDmg,
//       tailDmg: onedragon.tailDmg,
//       hp: onedragon.hp,
//       damage: onedragon.damage,
//       defence: onedragon.defence,
//       intelligence: onedragon.intelligence,
//       classifcation: onedragon.classifcation,

//     }
//     outobj.push(data)
//   }

//   if(dragon)
//   {
//     return res.json({
//       dragons:outobj,
//       total:Object.keys(outobj).length,
//       error: null,
//       success: true,
//     });
//   }
//     }
//     if(dbUser.username=="user3")
//     {
//       const dragon=await modelNFT.findAll({
//         where: {
//           id: {

//             [Op.between]: [21, 30],     // BETWEEN 6 AND 10

//           },
//         }})

//   let outobj=[]
//   for(let onedragon of dragon)
//   {
//     let dragonskills=await modelSkill.findAll({
//       where:{
//         dragon_class:onedragon.class
//       }
//     })
//     //console.log("Skills",dragonskills)

//     let data={
//       id : onedragon.id,
//      dragonid: onedragon.dragonid,
//       blockchain: onedragon.blockchain,
//       description: onedragon.description,
//       name: onedragon.name,
//       image: onedragon.image,
//       background: onedragon.background,
//       wings: onedragon.wings,
//       body: onedragon.body,
//       bodyscales: onedragon.bodyscales,
//       tail: onedragon.tail,
//       ears: onedragon.ears,
//       eyes: onedragon.eyes,
//       mouth: onedragon.mouth,
//       horns: onedragon.horns,
//       headpiece: onedragon.headpiece,
//       territory: onedragon.territory,
//       class:onedragon.class,
//       cardno:Object.keys(dragonskills).length,
//       cards: dragonskills,
//       attacktype: onedragon.attacktype,

//       earsIntel: onedragon.earsIntel,
//       eyesIntel: onedragon.eyesIntel,
//       headPieceIntel: onedragon.headPieceIntel,
//       hornsDmg: onedragon.hornsDmg,
//       mouthDmg: onedragon.mouthDmg,
//       scaleDef: onedragon.scaleDef,
//       wingsDmg: onedragon.wingsDmg,
//       tailDmg: onedragon.tailDmg,
//       hp: onedragon.hp,
//       damage: onedragon.damage,
//       defence: onedragon.defence,
//       intelligence: onedragon.intelligence,
//       classifcation: onedragon.classifcation,

//     }
//     outobj.push(data)
//   }

//   if(dragon)
//   {
//     return res.json({
//       dragons:outobj,
//       total:Object.keys(outobj).length,
//       error: null,
//       success: true,
//     });
//   }
//     }

//   //  const ct = new web3.eth.Contract(contractAbi, process.env.CONTRACT);
//   //  console.log("port",process.env.CONTRACT)
//   //  const ownerTokens = await ct.methods.tokensOfOwner(dbUser.walletaddress).call();
//   //  console.log("owenr tokens ::: ", ownerTokens);
//   //  let outobj=[]
//   //  for(let first of ownerTokens)
//   //  {
//   //    console.log("fIRST:",first)
//   //    let onedragon = await modelNFT.findOne(
//   //     {
//   //       where: { id: first },
//   //     }
//   //    );
//   //    let dragonskills=await modelSkill.findAll({
//   //      where:{
//   //        dragon_class:onedragon.class
//   //      }
//   //    })
//   //    //console.log("Skills",dragonskills)

//   //    let data={
//   //      id : onedragon.id,
//   //     dragonid: onedragon.dragonid,
//   //      blockchain: onedragon.blockchain,
//   //      description: onedragon.description,
//   //      name: onedragon.name,
//   //      image: onedragon.image,
//   //      background: onedragon.background,
//   //      wings: onedragon.wings,
//   //      body: onedragon.body,
//   //      bodyscales: onedragon.bodyscales,
//   //      tail: onedragon.tail,
//   //      ears: onedragon.ears,
//   //      eyes: onedragon.eyes,
//   //      mouth: onedragon.mouth,
//   //      horns: onedragon.horns,
//   //      headpiece: onedragon.headpiece,
//   //      territory: onedragon.territory,
//   //      class:onedragon.class,
//   //      cardno:Object.keys(dragonskills).length,
//   //      cards: dragonskills,
//   //      attacktype: onedragon.attacktype,
//   //      isMinted: onedragon.isMinted,
//   //      earsIntel: onedragon.earsIntel,
//   //      eyesIntel: onedragon.eyesIntel,
//   //      headPieceIntel: onedragon.headPieceIntel,
//   //      hornsDmg: onedragon.hornsDmg,
//   //      mouthDmg: onedragon.mouthDmg,
//   //      scaleDef: onedragon.scaleDef,
//   //      wingsDmg: onedragon.wingsDmg,
//   //      tailDmg: onedragon.tailDmg,
//   //      hp: onedragon.hp,
//   //      damage: onedragon.damage,
//   //      defence: onedragon.defence,
//   //      intelligence: onedragon.intelligence,
//   //      classifcation: onedragon.classifcation,

//   //    }
//   //    outobj.push(data)
//   //  }

//   //  if(ownerTokens)
//   //  {
//   //    return res.json({
//   //      dragons:outobj,
//   //      total:Object.keys(outobj).length,
//   //      error: null,
//   //      success: true,
//   //    });
//   //  }

//   } catch (error) {
//     next(error);
//   }
// },
