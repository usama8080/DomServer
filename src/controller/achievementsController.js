require("dotenv").config();
const models = require("../../models");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const allAchievemetns = require("../../data/AllAchievements.json");
const achievementSchema = require("../schemas/achievementSchema");
const AddAchievementScheme = require("../schemas/userAddAchievement");
const claimAchievement = require("../schemas/claimAchievement");
async function DragoncountThree(dragon1, dragon2, dragon3, userid) {
  try {
    let usedDragonsp1 = [dragon1, dragon2, dragon3];
    for (let dragons of usedDragonsp1) {
      const dragon = await models.Dragons.findByPk(dragons);
      if (!dragon) {
        return 404;
      }
      const useddragon = await models.Dragoncount.findOne({
        where: {
          DragonId: dragons,
          UserId: userid,
        },
      });
      if (!useddragon) {
        const adddragon = await models.Dragoncount.create({
          count: 1,
          DragonId: dragons,
          UserId: userid,
        });
      } else {
        await models.Dragoncount.increment(
          { count: 1 },
          { where: { UserId: userid, DragonId: dragons } }
        );
      }
    }
    return 200;
  } catch (error) {
    console.log("Error in function ::::::::::", error.message);
    return error.message;

    //next(error);
  }
}
async function DragoncountOne(dragon1, userid) {
  try {
    const dragon = await models.Dragons.findByPk(dragon1);
    if (!dragon) {
      return res.status(204).send({
        message: "Dragon not found with this ID ",
      });
    }
    const useddragon = await models.Dragoncount.findOne({
      where: {
        DragonId: dragon1,
        UserId: userid,
      },
    });
    if (!useddragon) {
      const adddragon = await models.Dragoncount.create({
        count: 1,
        DragonId: dragon1,
        UserId: userid,
      });
    } else {
      await models.Dragoncount.increment(
        { count: 1 },
        { where: { UserId: userid, DragonId: dragon1 } }
      );
    }

    return 200;
  } catch (error) {
    console.log("Error in function ::::::::::", error.message);
    return error.message;

    //next(error);
  }
}

module.exports = {
  // Add Achievements to All Achievement to database
  addAchievementsFromJSON: async (req, res, next) => {
    try {
      var achievementid = 0;
      for (item of allAchievemetns) {
        achievementid++;
        let Addachievemets = await models.Achievements.findOne({
          where: {
            name: item.name,
          },
        });
        if (!Addachievemets) {
          await models.Achievements.create({
            name: item.name,
            description: item.Description,
            xp: parseInt(item.XP),
            aura: parseInt(item.AURA),
            amount: item.Amount,
            typeOfAchievements: item.TypeofAchievment,
            image: `${process.env.URLMAIN}/icons/${achievementid}.png`,
          });
        }
      }
      res.status(200).json({
        data: "Achievement added",
        error: null,
        success: true,
      });
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Add Any new achievement
  addachievements: async (req, res, next) => {
    try {
      const body = await achievementSchema.validateAsync(req.body);
      const { name, description, xp, aura, amount, typeOfAchievements } = body;
      let isAchievemets = await models.Achievements.findOne({
        where: {
          name,
        },
      });

      if (isAchievemets) {
        throw new Error("Achievement Already Exists");
      }
      let addachievements = await models.Achievements.create({
        name,
        description,
        xp,
        aura,
        amount,
        typeOfAchievements,
      });
      if (addachievements) {
        return res.json({
          data: "Achievement added",
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Get All achievement in database
  getAllachievements: async (req, res, next) => {
    try {
      let allachievemets = await models.Achievements.findAll();
      if (!allAchievemetns || allachievemets == null) {
        throw new Error("No Achievement found ");
      } else {
        return res.json({
          data: allachievemets,
          total: Object.keys(allachievemets).length,
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Get All skills of all the Dragons
  getSkills: async (req, res, next) => {
    try {
      let allSkills = await models.Skill.findAll();
      if (!allSkills || allSkills == null) {
        throw new Error("No Achievement found ");
      } else {
        return res.json({
          data: allSkills,
          total: Object.keys(allSkills).length,
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Unlock Achievement of User
  addUserAchievements: async (req, res, next) => {
    try {
      const body = await AddAchievementScheme.validateAsync(req.body);
      const { achievementsId, BattleStatId } = body;
      let userid = req.user.id;
      let isPlayer = await models.User.findByPk(userid);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }
      let isach = await models.Achievements.findByPk(achievementsId);
      if (!isach) {
        throw new Error("Achievements  Not Exist");
      } else {
        await isPlayer.addAchievements(achievementsId, {
          through: { claim: false, BattleStatId: BattleStatId },
        });
        return res.json({
          data: "User Achievement added",
          error: null,
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // Find Achievement By ID
  findAchivementById: async (req, res, next) => {
    try {
      let id = req.params.id;
      let allachievemets = await models.Achievements.findByPk(id);
      if (!allAchievemetns || allachievemets == null) {
        throw new Error("No Achievement found ");
      } else {
        return res.json({
          data: allachievemets,
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Get All the user Unlocked Achievements
  getuserAchievements: async (req, res, next) => {
    try {
      let id = req.user.id;
      const isPlayer = await models.User.findOne({
        where: {
          id,
        },
        include: [
          {
            model: models.Achievements,
            attributes: ["id"],
          },
        ],
      });
      if (!isPlayer) {
        throw new Error("User Not Exist");
      } else {
        return res.json({
          data: isPlayer,
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Claim Achievement  of User
  claimAchievements: async (req, res, next) => {
    try {
      const body = await claimAchievement.validateAsync(req.body);
      const { achievementsId, claim } = body;
      let userid = req.user.id;
      let isPlayer = await models.User.findByPk(userid);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }
      let isach = await models.UnlockedAcheievements.findOne({
        where: {
          AchievementId: achievementsId,
          UserId: userid,
        },
      });
      if (!isach) {
        throw new Error("Achievements Not found ");
      } else {
        // await isPlayer.addAchievements(achievementsId ,{ through: { claim:claim } });
        let udpateAchievement = await models.UnlockedAcheievements.update(
          {
            claim,
          },
          {
            where: { AchievementId: achievementsId, UserId: userid },
          }
        );
        return res.json({
          data: "User Achievement Claim Successfully",
          error: null,
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  battle: async (req, res, next) => {
    try {
      const {
        useridp1,
        winlosep1,
        normalAttacksp1,
        specialAttacksp1,
        criticalAttacksp1,
        dragon1p1,
        dragon2p1,
        dragon3p1,
      } = req.body.player1;

      const {
        useridp2,
        winlosep2,
        normalAttacksp2,
        specialAttacksp2,
        criticalAttacksp2,
        dragon1p2,
        dragon2p2,
        dragon3p2,
      } = req.body.player2;
      const { type, duration, territory } = req.body;
      const newbattle = await models.Battle.create({
        type,
        duration,
        TerritoryId: territory,
      });
      const newBattleStatsP1 = await models.BattleStats.create({
        winlose: winlosep1,
        normalAttacks: normalAttacksp1,
        specialAttacks: specialAttacksp1,
        criticalAttacks: criticalAttacksp1,
        dragon1: dragon1p1,
        dragon2: dragon2p1,
        dragon3: dragon3p1,
        BattleId: newbattle.id,
        UserId: useridp1,
      });

      const newBattleStatsP2 = await models.BattleStats.create({
        winlose: winlosep2,
        normalAttacks: normalAttacksp2,
        specialAttacks: specialAttacksp2,
        criticalAttacks: criticalAttacksp2,
        dragon1: dragon1p2,
        dragon2: dragon2p2,
        dragon3: dragon3p2,
        BattleId: newbattle.id,
        UserId: useridp2,
      });

      if (type == "one") {
        await DragoncountOne(dragon1p1, useridp1);
        await DragoncountOne(dragon1p2, useridp2);
      } else if (type == "three") {
        await DragoncountThree(dragon1p1, dragon2p1, dragon3p1, useridp1);
        await DragoncountThree(dragon1p2, dragon2p2, dragon3p2, useridp2);
      }

      if (newbattle)
        return res.json({
          data: "battle details created",
          error: null,
          success: true,
        });
    } catch (error) {
      next(error);
    }
  },

  getbattlestats: async (req, res, next) => {
    try {
      let userid = req.user.id;
      const battlehist = await models.User.findOne({
        where: {
          id: userid,
        },
        include: [
          {
            model: models.BattleStats,
          },
          models.Dragoncount,
        ],
      });

      var finalarray = [];
      for (let battle of battlehist.BattleStats) {
        console.log("ya sub baatles id han :", battle.BattleId);
        let findbattle = await models.Battle.findOne({
          where: {
            id: battle.BattleId,
          },
          include: [
            {
              model: models.BattleStats,
              include: [
                {
                  model: models.UnlockedAcheievements,
                  //include: [models.Achievements],
                },
              ],
            },
            {
              model: models.Territories,
              attributes: ["id", "name"],
            },
          ],
        });
        finalarray.push(findbattle);
      }
      var finalobj = {};
      finalobj.Dragoncount = battlehist.Dragoncounts;
      finalobj.BattleHirstory = finalarray;

      if (battlehist)
        return res.json({
          data: finalobj,
          error: null,
          success: true,
        });
    } catch (error) {
      next(error);
    }
  },
};
