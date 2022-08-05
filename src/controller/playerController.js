const models = require("../../models");
const crypto = require("crypto");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const playerSchema = require("../schemas/playerSchema");
const killedbySchema = require("../schemas/killedBySchema");
const killedSchema = require("../schemas/killedSchema");

const battleschema = require("../schemas/battleSchema");

const battlesCommonSchema = require("../schemas/battleCommonSchema");

const skillUsed = require("../schemas/skillUsed");
const playerSchemaall = require("../schemas/playerSchemaAll");
const skills = require("../../data/skills.json");
const territory = require("../../data/territories.json");
const allAchievemetns = require("../../data/AllAchievements.json");
async function updatePlayerstats(
  playerid,
  xp,
  level,
  grade,
  aura,
  wins,
  loses,
  played,
  hoursPlayed,
  winStreak,
  dodge,
  steal,
  frozen,
  killCount,
  dailyStreak,
  matchesWonWithAll3Dragon,
  lossStreak,
  criticalKills
) {
  try {
    let updatePlayer1 = await models.PlayerStat.update(
      {
        xp,
        level,
        grade,
        aura,
        wins,
        loses,
        played,
        hoursPlayed,
        winStreak,
        dodge,
        steal,
        frozen,
        killCount,
        dailyStreak,
        matchesWonWithAll3Dragon,
        lossStreak,
        criticalKills,
      },
      { where: { UserId: playerid } }
    );
    if (updatePlayer1) {
      let obj = {
        status: true,
        function: "PlayerStats",
        message: "SuccessFull",
      };
      return obj;
    }
  } catch (error) {
    let obj = {
      status: true,
      function: "PlayerStats",
      message: error.message,
    };
    return obj;
  }
}
async function Dragoncount(alldragons, userid) {
  try {
    //let usedDragonsp1 = [dragon1, dragon2, dragon3];
    for (let dragons of alldragons) {
      const dragon = await models.Dragons.findByPk(dragons);
      if (!dragon) {
        let obj = {
          status: false,
          function: "DragonCount",
          message: "Dragons Not Found",
        };
        return obj;
        //return 404;
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
        let obj = {
          status: true,
          function: "Dragon Count",
          message: "Successfull",
        };
        return obj;
      } else {
        await models.Dragoncount.increment(
          { count: 1 },
          { where: { UserId: userid, DragonId: dragons } }
        );
        let obj = {
          status: true,
          function: "Dragon Count",
          message: "Successfull",
        };
        return obj;
      }
    }
    //return 200;
  } catch (error) {
    console.log("Error in function ::::::::::", error.message);

    let obj = {
      status: true,
      function: "Dragon Count",
      message: error.message,
    };
    return obj;
    //next(error);
  }
}

async function killedAndKilledBy(player1, player2, win, loose) {
  try {
    /// Killed
    var checkKilled;
    var checkKilledBy;
    if (win === player1 && loose === player2) {
      checkKilled = await models.Killed.findOne({
        where: {
          UserId: player1,
          killedid: player2,
        },
      });
      if (!checkKilled) {
        await models.Killed.create({
          count: 1,
          UserId: player1,
          killedid: player2,
        });
      } else {
        await models.Killed.increment(
          { count: 1 },
          { where: { UserId: player1, killedid: player2 } }
        );
      }

      //// Killed By
      checkKilledBy = await models.KilledBy.findOne({
        where: {
          UserId: player2,
          killedbyid: player1,
        },
      });

      if (!checkKilledBy) {
        await models.KilledBy.create({
          count: 1,
          killedbyid: player1,
          UserId: player2,
        });
      } else {
        await models.KilledBy.increment(
          { count: 1 },
          { where: { UserId: player2, killedbyid: player1 } }
        );
      }
    } else if (win === player2 && loose === player1) {
      checkKilled = await models.Killed.findOne({
        where: {
          UserId: player2,
          killedid: player1,
        },
      });
      if (!checkKilled) {
        await models.KilledBy.create({
          count: 1,
          killedbyid: player2,
          UserId: player1,
        });
      } else {
        await models.Killed.increment(
          { count: 1 },
          { where: { UserId: player1, killedid: player2 } }
        );
      }

      checkKilledBy = await models.KilledBy.findOne({
        where: {
          UserId: player1,
          killedbyid: player2,
        },
      });
      if (!checkKilledBy) {
        await models.KilledBy.create({
          count: 1,
          killedbyid: player2,
          UserId: player1,
        });
      } else {
        await models.KilledBy.increment(
          { count: 1 },
          { where: { UserId: player1, killedbyid: player2 } }
        );
      }
    }
    let obj = {
      status: true,
      function: "KilledBY",
      message: "successfull",
    };
    return obj;
  } catch (error) {
    console.log("Error in function ::::::::::", error.message);
    let obj = {
      status: false,
      function: "KilledBY Error",
      message: error.message,
    };
    return obj;
    //return error.message;

    //next(error);
  }
}

async function UpdateBattleStats(
  winlose,
  normalAttacks,
  specialAttacks,
  criticalAttacks,
  dragons,
  BattleId,
  UserId
) {
  try {
    var newBattleStatsP1;
    if (dragons.length == 1) {
      newBattleStatsP1 = await models.BattleStats.create({
        winlose,
        normalAttacks,
        specialAttacks,
        criticalAttacks,
        dragon1: dragons[0],
        BattleId,
        UserId,
      });
    } else {
      newBattleStatsP1 = await models.BattleStats.create({
        winlose,
        normalAttacks,
        specialAttacks,
        criticalAttacks,
        dragon1: dragons[0],
        dragon2: dragons[1],
        dragon3: dragons[2],
        BattleId,
        UserId,
      });
    }

    let addcount = await Dragoncount(dragons, UserId);
    if (addcount.status == true && newBattleStatsP1) {
      let obj = {
        status: true,
        function: "BattleStats",
        message: "SuccessFull",
      };
      return obj;
      //return 200;
    }
  } catch (error) {
    console.log("Error in function ::::::::::", error.message);
    let obj = {
      status: true,
      function: "BattleStats",
      message: error.message,
    };
    return obj;

    //next(error);
  }
}

async function skillsUpdate(skills, userid) {
  try {
    console.log("SKILSSS *********************", skills);
    for (let skill of skills) {
      let isSkills = await models.Skill.findByPk(skill.id);
      if (!isSkills) {
        let obj = {
          status: false,
          function: "Skills",
          message: "Skill Not Found",
        };
        return obj;
      }
      let checkSkills = await models.SkillUsed.findOne({
        where: { UserId: userid, skillId: skill.id },
      });
      if (!checkSkills) {
        await models.SkillUsed.create({
          count: skill.count,
          skillId: skill.id,
          UserId: userid,
        });
        // let obj = {
        //   status: true,
        //   function: "Skills",
        //   message: "Successfull",
        // };
        // return obj;
      } else {
        await models.SkillUsed.update(
          { count: skill.count },
          { where: { UserId: userid, skillId: skill.id } }
        );

        //return true;
      }
    }
    let obj = {
      status: true,
      function: "Skills",
      message: "Successfull",
    };
    return obj;
  } catch (error) {
    console.log(" Skills Erros ::::::::::::::::", error.message);
    let obj = {
      status: false,
      message: error.message,
    };
    return obj;
    //return error;
  }
}

async function unlockuseraAchievements(userid, achievementPlayer, battleid) {
  try {
    for (let achievement of achievementPlayer) {
      const UnlockedAcheievements = await models.UnlockedAcheievements.create({
        claim: false,
        AchievementId: achievement,
        UserId: userid,
        BattleId: battleid,
      });
      if (!UnlockedAcheievements) {
        let obj = {
          status: false,
          function: "Achievements",
          message: "Error",
        };
        return obj;
      }
    }
    let obj = {
      status: true,
      function: "Achievements",
      message: "Achievements Added Successfully",
    };
    return obj;
  } catch (error) {
    console.log(" Achievements Erros ::::::::::::::::", error);
    let obj = {
      status: false,
      function: "Achievements",
      message: error.message,
    };
    return obj;
  }
}
module.exports = {
  // update use player stats only

  updatePlayer: async (req, res, next) => {
    try {
      //const id =req.params.id;

      let id = req.user.id;
      const body = await playerSchema.validateAsync(req.body);
      const {
        xp,
        level,
        grade,
        aura,
        wins,
        loses,
        played,
        hoursPlayed,
        winStreak,
        dodge,
        steal,
        frozen,
        killCount,
        dailyStreak,
        matchesWonWithAll3Dragon,
        lossStreak,
      } = body;
      let isPlayer = await models.User.findByPk(id);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }

      let isPlayeStats = await models.PlayerStat.findOne({
        where: {
          UserId: id,
        },
      });

      if (isPlayeStats) {
        let DataUpdated = await models.PlayerStat.update(
          {
            xp,
            level,
            grade,
            aura,
            wins,
            loses,
            played,
            hoursPlayed,
            winStreak,
            dodge,
            steal,
            frozen,
            killCount,
            dailyStreak,
            matchesWonWithAll3Dragon,
            lossStreak,
          },
          { where: { UserId: id } }
        );
        if (DataUpdated) {
          return res.json({
            data: "Stats Updated",
            error: null,
            success: true,
          });
        }
      }

      {
        let createdstat = await models.PlayerStat.create({ UserId: id });
        let DataUpdated = await models.PlayerStat.update(
          {
            xp,
            level,
            grade,
            aura,
            wins,
            loses,
            played,
            hoursPlayed,
            dodge,
            steal,
            frozen,
            killCount,
            dailyStreak,
            matchesWonWithAll3Dragon,
            lossStreak,
          },
          { where: { UserId: id } }
        );
        if (DataUpdated) {
          return res.json({
            data: "Stats Updated",
            error: null,
            success: true,
          });
        }
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },
  // get all player Stats
  findPlayserStatsById: async (req, res, next) => {
    try {
      let id = req.user.id;
      const playerStat = await models.User.findOne({
        where: {
          id,
        },
        attributes: ["username"],
        include: [
          models.PlayerStat,
          {
            model: models.KilledBy,
            attributes: ["count", "killedbyid"],
          },
          {
            model: models.Killed,
            attributes: ["count", "killedid"],
          },
          {
            model: models.SkillUsed,
            attributes: ["skillId", "count"],
          },
          {
            model: models.Achievements,
          },
        ],
      });
      if (playerStat) {
        return res.json({
          data: playerStat,
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },
  // create player Killed By
  killedby: async (req, res, next) => {
    try {
      const body = await killedbySchema.validateAsync(req.body);
      const { count, killedbyid } = body;
      //const UserId=req.user.id;
      const UserId = req.user.id;

      let isPlayer = await models.User.findByPk(UserId);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }
      let isKilledBy = await models.KilledBy.findOne({
        where: {
          UserId,
          killedbyid,
        },
      });
      if (isKilledBy == null) {
        let createdstat = await models.KilledBy.create({
          count,
          UserId,
          killedbyid,
        });
        if (createdstat) {
          res.json({
            data: "Played Die Updated",
            error: null,
            success: true,
          });
        }
      } else {
        let createdstat = await models.KilledBy.update(
          { count },
          { where: { UserId, killedbyid } }
        );
        if (createdstat) {
          res.json({
            data: "Played Die Updated",
            error: null,
            success: true,
          });
        }
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },
  findKilledBy: async (req, res, next) => {
    try {
      let id = req.user.id;

      let isKilledBy = await await models.KilledBy.findAll({
        where: {
          UserId: id,
        },
      });
      if (isKilledBy) {
        return res.json({
          data: isKilledBy,
          error: null,
          success: true,
        });
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },
  killed: async (req, res, next) => {
    try {
      const body = await killedSchema.validateAsync(req.body);
      const { count, killedid } = body;
      const UserId = req.user.id;

      let isPlayer = await models.User.findByPk(UserId);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }
      let isKilledBy = await models.Killed.findOne({
        where: {
          UserId,
          killedid,
        },
      });
      if (isKilledBy == null) {
        let createdstat = await models.Killed.create({
          count,
          UserId,
          killedid,
        });
        if (createdstat) {
          res.json({
            data: "Played Killed Updated",
            error: null,
            success: true,
          });
        }
      } else {
        let createdstat = await models.Killed.update(
          { count },
          { where: { UserId, killedid } }
        );
        if (createdstat) {
          res.json({
            data: "Played Killed Updated",
            error: null,
            success: true,
          });
        }
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  findKilled: async (req, res, next) => {
    try {
      let id = req.user.id;

      let isKilled = await await models.Killed.findAll({
        where: {
          UserId: id,
        },
      });
      if (isKilled) {
        return res.json({
          data: isKilled,
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Player used Skills in game
  usedSkills: async (req, res, next) => {
    try {
      const body = await skillUsed.validateAsync(req.body);
      const { count, skillId } = body;
      let UserId = req.user.id;
      let isPlayer = await models.User.findByPk(UserId);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }
      let isSkills = await models.Skill.findByPk(skillId);
      if (!isSkills) {
        throw new Error("Skill Not Found");
      }

      let checkSkills = await models.SkillUsed.findOne({
        where: { UserId, skillId: skillId },
      });
      if (!checkSkills) {
        let addskils = await models.SkillUsed.create({
          count,
          skillId: skillId,
          UserId,
        });
        if (!addskils) {
          return res.json({
            data: "New Skills Added ",
            error: null,
            success: true,
          });
        }
      }
      let updateskill = await models.SkillUsed.update(
        { count },
        { where: { UserId, skillId: skillId } }
      );
      if (updateskill) {
        return res.json({
          data: "Skills Updated ",
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  // Update user All stats +killedBy+ killed  and skills too
  updateAllStats: async (req, res, next) => {
    try {
      //const id =req.params.id;

      const id = req.user.id;
      const body = req.body;
      const {
        xp,
        level,
        grade,
        aura,
        wins,
        loses,
        played,
        hoursPlayed,
        winStreak,
        dodge,
        steal,
        frozen,
        killCount,
        dailyStreak,
        matchesWonWithAll3Dragon,
        lossStreak,
        criticalKills,
      } = body.PlayerStat;
      const { killedbyid } = body.KilledBies;
      const countby = body.KilledBies.count;
      const { killedid, count } = body.Killed;
      const skillUsed = body.SkillUseds;
      const usedTerritories = body.Territory;
      const checkkills = req.query.name;

      var isPlayer = await models.User.findByPk(id);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }
      let isPlayeStats = await models.PlayerStat.findOne({
        where: {
          UserId: id,
        },
      });

      if (isPlayeStats) {
        let updatedPlayerStat = await models.PlayerStat.update(
          {
            xp,
            level,
            grade,
            aura,
            wins,
            loses,
            played,
            hoursPlayed,
            winStreak,
            dodge,
            steal,
            frozen,
            killCount,
            dailyStreak,
            matchesWonWithAll3Dragon,
            lossStreak,
            criticalKills,
          },
          { where: { UserId: id } }
        );
        var checkkilled;
        if (checkkills == "killed") {
          checkkilled = await models.Killed.findOne({
            where: {
              UserId: id,
              killedid,
            },
          });
          if (checkkilled) {
            await models.Killed.update(
              { count },
              { where: { UserId: id, killedid } }
            );
          } else {
            await models.Killed.create({ count, killedid, UserId: id });
          }
        } else {
          if (checkkills == "killedby") {
            checkkilled = await models.KilledBy.findOne({
              where: {
                UserId: id,
                killedbyid,
              },
            });
            if (checkkilled) {
              await models.KilledBy.update(
                { count: countby },
                { where: { UserId: id, killedbyid } }
              );
            } else {
              await models.KilledBy.create({
                count: countby,
                killedbyid,
                UserId: id,
              });
            }
          } else {
            throw new Error("InValid params , it will be killed / Killed By");
          }
        }
        for (let skill of skillUsed) {
          let isSkills = await models.Skill.findByPk(skill.skillId);
          if (!isSkills) {
            throw new Error("Skill Not Found");
          }
          let checkSkills = await models.SkillUsed.findOne({
            where: { UserId: id, skillId: skill.skillId },
          });
          if (!checkSkills) {
            await models.SkillUsed.create({
              count: skill.count,
              skillId: skill.skillId,
              UserId: id,
            });
          } else {
            await models.SkillUsed.update(
              { count: skill.count },
              { where: { UserId: id, skillId: skill.skillId } }
            );
          }
        }
        ///    await isPlayer.addTerritories(usedTerritories.id);
        if (updatedPlayerStat && checkkilled) {
          return res.json({
            data: "Stats Updated",
            error: null,
            success: true,
          });
        }
      } else {
        let createdstat = await models.PlayerStat.create({ UserId: id });
        let DataUpdated = await models.PlayerStat.update(
          {
            xp,
            level,
            grade,
            aura,
            wins,
            loses,
            played,
            hoursPlayed,
            dodge,
            steal,
            frozen,
            killCount,
            dailyStreak,
            matchesWonWithAll3Dragon,
            lossStreak,
            criticalKills,
          },
          { where: { UserId: id } }
        );

        if (checkkills == "killed") {
          await models.Killed.create({ count, killedid, UserId: id });
        } else {
          if (checkkills == "killedby") {
            await models.KilledBy.create({
              count: countby,
              killedbyid,
              UserId: id,
            });
          } else {
            throw new Error("InValid params , it will be killed / Killed By");
          }
        }

        for (let skill of skillUsed) {
          let isSkills = await models.Skill.findByPk(skill.skillId);
          if (!isSkills) {
            throw new Error("Skill Not Found");
          }
          let checkSkills = await models.SkillUsed.findOne({
            where: { UserId: id, skillId: skill.skillId },
          });
          if (!checkSkills) {
            await models.SkillUsed.create({
              count: skill.count,
              skillId: skill.skillId,
              UserId: id,
            });
          } else {
            await models.SkillUsed.update(
              { count: skill.count },
              { where: { UserId: id, skillId: skill.skillId } }
            );
          }
        }
        //   await isPlayer.addTerritories(usedTerritories.id);
        if (DataUpdated) {
          return res.json({
            data: "Stats Updated",
            error: null,
            success: true,
          });
        }
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  getInventory: async (req, res, next) => {
    try {
      let allachievemets = await models.Achievements.findAll();
      let allSkills = await models.Skill.findAll();
      let territory = await models.Territories.findAll();
      return res.json({
        Achievements: allachievemets,
        totalAchievemets: Object.keys(allachievemets).length,
        SKills: allSkills,
        totalSkills: Object.keys(allSkills).length,
        territories: territory,
        totalTerritories: Object.keys(territory).length,
        error: null,
        success: true,
      });
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },
  addInventory: async (req, res, next) => {
    // Add Achievemetns
    let achievementid = 0;
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
    // ADD All territory
    for (item of territory) {
      console.log("ITEMMMMMMMMMMMMMMMMM", item);
      let Territory = await models.Territories.findOne({
        where: {
          name: item.name,
          imageurl: item.image,
        },
      });
      if (!Territory) {
        await models.Territories.create({
          name: item.name,
          imageurl: item.image,
        });
      }
    }
    // Add All skills
    for (item of skills) {
      let skill = await models.Skill.findOne({
        where: {
          dragonClass: item.dragon_class,
          skillName: item.skill_name,
          skillType: item.skill_type,
          basicDamage: item.basic_damage,
          basicDefense: item.basic_defense,
          specialDamage: item.special_damage,
          specialConditions: item.special_conditions,
          description: item.description,
          criticalProbability: item.critical_probability,
          criticalDamage: item.critical_damage,
          criticalDefense: item.critical_defense,
          ManaConsumed: item.MANA_consumed,
        },
      });
      if (!skill) {
        //console.log("Skills", item);
        let newNft = await models.Skill.create({
          dragonClass: item.dragon_class,
          skillName: item.skill_name,
          skillType: item.skill_type,
          basicDamage: item.basic_damage,
          basicDefense: item.basic_defense,
          specialDamage: item.special_damage,
          specialConditions: item.special_conditions,
          description: item.description,
          criticalProbability: item.critical_probability,
          criticalDamage: item.critical_damage,
          criticalDefense: item.critical_defense,
          ManaConsumed: item.MANA_consumed,
        });
      }
    }
    return res.json({
      data: "Achievements ,Territories and skills are added ",
      error: null,
      success: true,
    });
  },

  // battle: async (req, res, next) => {
  //   try {
  //     const {
  //       useridp1,
  //       winlosep1,
  //       normalAttacksp1,
  //       specialAttacksp1,
  //       criticalAttacksp1,
  //       dragon1p1,
  //       dragon2p1,
  //       dragon3p1,
  //     } = req.body.player1;

  //     const {
  //       useridp2,
  //       winlosep2,
  //       normalAttacksp2,
  //       specialAttacksp2,
  //       criticalAttacksp2,
  //       dragon1p2,
  //       dragon2p2,
  //       dragon3p2,
  //     } = req.body.player2;
  //     const { type, duration, territory } = req.body;
  //     const newbattle = await models.Battle.create({
  //       type,
  //       duration,
  //       TerritoryId: territory,
  //     });
  //     const newBattleStatsP1 = await models.BattleStats.create({
  //       winlose: winlosep1,
  //       normalAttacks: normalAttacksp1,
  //       specialAttacks: specialAttacksp1,
  //       criticalAttacks: criticalAttacksp1,
  //       dragon1: dragon1p1,
  //       dragon2: dragon2p1,
  //       dragon3: dragon3p1,
  //       BattleId: newbattle.id,
  //       UserId: useridp1,
  //     });

  //     const newBattleStatsP2 = await models.BattleStats.create({
  //       winlose: winlosep2,
  //       normalAttacks: normalAttacksp2,
  //       specialAttacks: specialAttacksp2,
  //       criticalAttacks: criticalAttacksp2,
  //       dragon1: dragon1p2,
  //       dragon2: dragon2p2,
  //       dragon3: dragon3p2,
  //       BattleId: newbattle.id,
  //       UserId: useridp2,
  //     });

  //     if (type == "one") {
  //       await DragoncountOne(dragon1p1, useridp1);
  //       await DragoncountOne(dragon1p2, useridp2);
  //     } else if (type == "three") {
  //       await DragoncountThree(dragon1p1, dragon2p1, dragon3p1, useridp1);
  //       await DragoncountThree(dragon1p2, dragon2p2, dragon3p2, useridp2);
  //     }

  //     if (newbattle)
  //       return res.json({
  //         data: "battle details created",
  //         error: null,
  //         success: true,
  //       });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  getbattlestats: async (req, res, next) => {
    try {
      let userid = req.user.id;
      var battlehist = await models.User.findAll({
        where: {
          id: userid,
        },
        include: [
          models.PlayerStat,
          {
            model: models.BattleStats,
            include: [
              {
                model: models.Battle,
                include: [
                  {
                    model: models.Territories,
                  },
                  {
                    model: models.UnlockedAcheievements,
                    where: {
                      UserId: userid,
                    },
                    include: [
                      {
                        model: models.Achievements,
                      },
                    ],
                  },
                ],
              },
            ],
          },

          models.Dragoncount,
          models.KilledBy,
          models.Killed,
          {
            model: models.SkillUsed,
            include: [
              {
                model: models.Skill,
              },
            ],
          },
          models.Dragoncount,
          //models.Achievements,
        ],
      });
      console.log(" battlehist.:", battlehist.BattleStats);
      // var finalarray = [];
      // for (let battle of battlehist.BattleStats) {
      //   console.log("ya sub baatles id han :", battle.BattleId);
      //   let findbattle = await models.Battle.findOne({
      //     where: {
      //       id: battle.BattleId,
      //     },
      //     include: [
      //       {
      //         model: models.BattleStats,
      //         include: [
      //           {
      //             model: models.UnlockedAcheievements,
      //             //include: [models.Achievements],
      //           },
      //         ],
      //       },
      //       {
      //         model: models.Territories,
      //         attributes: ["id", "name"],
      //       },
      //     ],
      //   });
      //   finalarray.push(findbattle);
      // }
      // var finalobj = {};
      // finalobj.Dragoncount = battlehist.Dragoncounts;
      // finalobj.BattleHirstory = finalarray;

      if (battlehist)
        return res.json({
          data: battlehist[0],
          error: null,
          success: true,
        });
    } catch (error) {
      next(error);
    }
  },

  ///
  newbattle: async (req, res, next) => {
    try {
      // Player One Stats
      const playerStatsP1 = await playerSchema.validateAsync(
        req.body.playerstatsPlayer1
      );

      // Comon Battle attributes
      const common = await battlesCommonSchema.validateAsync(req.body.common);
      const { duration, territory, win, loose } = common;
      // Player One  Battle stats
      const battleStatsP1 = await battleschema.validateAsync(
        req.body.BattlestatsPlayer1
      );
      const normalAttacksPlayer1 = battleStatsP1.normalAttacks;
      const specialAttacksPlayer1 = battleStatsP1.specialAttacks;
      const criticalAttacksPlayer1 = battleStatsP1.criticalAttacks;
      const dragonsPlayer1 = battleStatsP1.dragon;
      const type = battleStatsP1.type;
      const skillsPlayer1 = battleStatsP1.skills;
      const achievementPlayer1 = battleStatsP1.achievements;
      const useridPlayer1 = playerStatsP1.playerid;
      const xpPlayer1 = playerStatsP1.xp;
      const levelPlayer1 = playerStatsP1.level;
      const gradePlayer1 = playerStatsP1.grade;
      const auraPlayer1 = playerStatsP1.aura;
      const winsPlayer1 = playerStatsP1.wins;
      const losesPlayer1 = playerStatsP1.loses;
      const playedPlayer1 = playerStatsP1.played;
      const hoursPlayedPlayer1 = playerStatsP1.hoursPlayed;
      const winStreakPlayer1 = playerStatsP1.winStreak;
      const dodgePlayer1 = playerStatsP1.dodge;
      const stealPlayer1 = playerStatsP1.steal;
      const frozenPlayer1 = playerStatsP1.frozen;
      const killCountPlayer1 = playerStatsP1.killCount;
      const dailyStreakPlayer1 = playerStatsP1.dailyStreak;
      const matchesWonWithAll3DragonPlayer1 =
        playerStatsP1.matchesWonWithAll3Dragon;
      const lossStreakPlayer1 = playerStatsP1.lossStreak;
      const criticalKillsPlayer1 = playerStatsP1.criticalKills;

      //
      // Player One Stats
      const playerStatsPlayer2 = await playerSchema.validateAsync(
        req.body.playerstatsPlayer2
      );
      // Player One  Battle stats
      const battleStatsPlayer2 = await battleschema.validateAsync(
        req.body.BattlestatsPlayer2
      );
      const normalAttacksPlayer2 = battleStatsPlayer2.normalAttacks;
      const specialAttacksPlayer2 = battleStatsPlayer2.specialAttacks;
      const criticalAttacksPlayer2 = battleStatsPlayer2.criticalAttacks;
      const dragonsPlayer2 = battleStatsPlayer2.dragon;
      const typePlayer2 = battleStatsPlayer2.type;
      const skillsPlayer2 = battleStatsPlayer2.skills;
      const achievementPlayer2 = battleStatsPlayer2.achievements;
      const useridPlayer2 = playerStatsPlayer2.playerid;
      const xpPlayer2 = playerStatsPlayer2.xp;
      const levelPlayer2 = playerStatsPlayer2.level;
      const gradePlayer2 = playerStatsPlayer2.grade;
      const auraPlayer2 = playerStatsPlayer2.aura;
      const winsPlayer2 = playerStatsPlayer2.wins;
      const losesPlayer2 = playerStatsPlayer2.loses;
      const playedPlayer2 = playerStatsPlayer2.played;
      const hoursPlayedPlayer2 = playerStatsPlayer2.hoursPlayed;
      const winStreakPlayer2 = playerStatsPlayer2.winStreak;
      const dodgePlayer2 = playerStatsPlayer2.dodge;
      const stealPlayer2 = playerStatsPlayer2.steal;
      const frozenPlayer2 = playerStatsPlayer2.frozen;
      const killCountPlayer2 = playerStatsPlayer2.killCount;
      const dailyStreakPlayer2 = playerStatsPlayer2.dailyStreak;
      const matchesWonWithAll3DragonPlayer2 =
        playerStatsPlayer2.matchesWonWithAll3Dragon;
      const lossStreakPlayer2 = playerStatsPlayer2.lossStreak;
      const criticalKillsPlayer2 = playerStatsPlayer2.criticalKills;
      console.table({ type, typePlayer2 });
      if (type != typePlayer2) {
        return res.status(400).send({
          message: "Game type must be same ",
        });
      }
      /// Check Achievement for User one

      console.log(
        "****************    Achievement check user 1 *****************"
      );
      for (let achievement of achievementPlayer1) {
        const isachievemets = await models.Achievements.findByPk(achievement);
        if (!isachievemets) {
          return res.status(500).json({
            message: `This Achivement ID : ${achievement} not found `,
          });
        }
        const islockAchievements = await models.UnlockedAcheievements.findOne({
          where: {
            [Op.or]: [{ claim: true }, { claim: false }],
            AchievementId: achievement,
            UserId: useridPlayer1,
            // [Op.or]: [{ battleid }, { battleid: null }],
          },
        });
        if (islockAchievements) {
          return res.status(409).json({
            message: `This Achivement ID : ${achievement} already Unlocked `,
          });
        }
      }
      /// Check Achievement for User TWO
      console.log(
        "****************    Achievement check user 2 *****************"
      );
      for (let achievement of achievementPlayer2) {
        const isachievemets = await models.Achievements.findByPk(achievement);
        if (!isachievemets) {
          return res.status(500).json({
            message: `This Achivement ID : ${achievement} not found `,
          });
        }
        const islockAchievements = await models.UnlockedAcheievements.findOne({
          where: {
            [Op.or]: [{ claim: true }, { claim: false }],
            AchievementId: achievement,
            UserId: useridPlayer2,
            // [Op.or]: [{ battleid }, { battleid: null }],
          },
        });
        if (islockAchievements) {
          return res.status(409).json({
            message: `This Achivement ID : ${achievement} already Unlocked `,
          });
        }
      }

      /// User Exist with id
      console.log("****************     check user 1 *****************");
      var isPlayer = await models.User.findByPk(useridPlayer1);
      if (!isPlayer) {
        throw new Error("User Not Exist");
      }
      console.log(
        "****************    PlayerStats check user 1 *****************"
      );
      let isPlayeStats = await models.PlayerStat.findOne({
        where: {
          UserId: useridPlayer1,
        },
      });

      console.log("****************    Creating Battle  *****************");
      const newbattle = await models.Battle.create({
        type,
        duration,
        TerritoryId: territory,
      });
      if (win === useridPlayer1) {
        var winloosePlayer1 = true;
        var winloosePlayer2 = false;
      } else if (win === useridPlayer2) {
        var winloosePlayer1 = false;
        var winloosePlayer2 = true;
      } else {
        return res.status(400).send({
          message: "Invalid request for win and loose ",
        });
      }

      console.log(
        "****************    UpdateBattle Status  check user 1 *****************"
      );
      var updatebattleStatsP1 = await UpdateBattleStats(
        winloosePlayer1,
        normalAttacksPlayer1,
        specialAttacksPlayer1,
        criticalAttacksPlayer1,
        dragonsPlayer1,
        newbattle.id,
        useridPlayer1
      );

      /// Killed
      console.log(
        "****************    UpdateKIlls  Status  check user 1 *****************"
      );
      let updatekilledByPlayer1 = await killedAndKilledBy(
        useridPlayer1,
        useridPlayer2,
        win,
        loose
      );
      console.log(
        "****************    UpdateKIlls  Status  check user 1 *****************",
        updatekilledByPlayer1
      );
      if (updatekilledByPlayer1.status == false) {
        //throw new Error(updateSkills.message);
        return res.status(400).send({
          function: "Skills",
          message: updatekilledByPlayer1.message,
        });
      }
      updatekilledByPlayer1;
      // update Skills
      console.log("****************    Skills check user 1 *****************");

      let updateSkillsPlayer1 = await skillsUpdate(
        skillsPlayer1,
        useridPlayer1
      );

      if (updateSkillsPlayer1.status == false) {
        //throw new Error(updateSkills.message);
        return res.status(400).send({
          function: "Skills",
          message: updateSkills.message,
        });
      }
      const achlenghth = achievementPlayer1.length;
      console.log(
        "****************    Unlock Achievements check user 1 *****************"
      );
      if (achlenghth > 0) {
        console.log("AChivement chal rai han ");
        await unlockuseraAchievements(
          useridPlayer1,
          achievementPlayer1,
          newbattle.id
        );
      } else {
        console.log("ulta chal rha ha");
      }
      if (!isPlayeStats) {
        console.log("Creating Stats");
        let createPlayer1Stats = await models.PlayerStat.create({
          UserId: useridPlayer1,
        });
        console.log(
          "****************    UpdatePlayer Status  check user 1 *****************"
        );
        var updatePlayer1Stats = await updatePlayerstats(
          useridPlayer1,
          xpPlayer1,
          levelPlayer1,
          gradePlayer1,
          auraPlayer1,
          winsPlayer1,
          losesPlayer1,
          playedPlayer1,
          hoursPlayedPlayer1,
          dodgePlayer1,
          stealPlayer1,
          winStreakPlayer1,
          frozenPlayer1,
          killCountPlayer1,
          dailyStreakPlayer1,
          matchesWonWithAll3DragonPlayer1,
          lossStreakPlayer1,
          criticalKillsPlayer1
        );
        console.log("Ya final status ha update ka:", updatePlayer1Stats);
      } else {
        var updatePlayer1Stats = await updatePlayerstats(
          useridPlayer1,
          xpPlayer1,
          levelPlayer1,
          gradePlayer1,
          auraPlayer1,
          winsPlayer1,
          losesPlayer1,
          playedPlayer1,
          hoursPlayedPlayer1,
          dodgePlayer1,
          stealPlayer1,
          winStreakPlayer1,
          frozenPlayer1,
          killCountPlayer1,
          dailyStreakPlayer1,
          matchesWonWithAll3DragonPlayer1,
          lossStreakPlayer1,
          criticalKillsPlayer1
        );
      }
      console.log(
        "****************    Territory  check user 1 *****************"
      );

      let findterritory = await models.Territories.findByPk(territory);
      if (!findterritory) {
        return res.status(404).send({
          message: "Invalid territory ID",
        });
      }

      //// Player two
      console.log("****************    check user 2 *****************");
      var isPlayer2 = await models.User.findByPk(useridPlayer2);
      if (!isPlayer2) {
        throw new Error("User Not Exist");
      }

      //Update Battle Stats Player 2
      console.log(
        "****************    Update Battles Stats  check user 2 *****************"
      );
      var updatebattleStatsP2 = await UpdateBattleStats(
        winloosePlayer2,
        normalAttacksPlayer2,
        specialAttacksPlayer2,
        criticalAttacksPlayer2,
        dragonsPlayer2,
        newbattle.id,
        useridPlayer2
      );
      if (updatebattleStatsP2.status == false) {
        return res.status(400).send({
          function: updatebattleStatsP2.function,
          message: updatebattleStatsP2.message,
        });
      }
      console.log(
        "****************    Update  Skills  check user 2 *****************"
      );
      var updateSkillsPlayer2 = await skillsUpdate(
        skillsPlayer2,
        useridPlayer2
      );

      if (updateSkillsPlayer2.status == false) {
        //throw new Error(updateSkills.message);
        return res.status(400).send({
          function: updateSkills.function,
          message: updateSkills.message,
        });
      }

      const achivementLengthPlayer2 = achievementPlayer2.length;
      console.log(
        "****************   Achievement Update  check user 2 *****************"
      );
      if (achivementLengthPlayer2 > 0) {
        // console.log("AChivement chal rai han ");
        var unlockachievementp1 = await unlockuseraAchievements(
          useridPlayer2,
          achievementPlayer2,
          newbattle.id
        );
        if (unlockachievementp1.status == false) {
          return res.status(400).send({
            function: unlockachievementp1.function,
            message: unlockachievementp1.message,
          });
        }
      }
      let isPlayeStatsP2 = await models.PlayerStat.findOne({
        where: {
          UserId: useridPlayer2,
        },
      });

      console.log(
        "****************   Player Stats Update  check user 2 *****************"
      );
      var updatePlayer2Stats;
      if (!isPlayeStatsP2) {
        console.log("Creating Stats");
        let createPlayer2Stats = await models.PlayerStat.create({
          UserId: useridPlayer2,
        });

        updatePlayer2Stats = await updatePlayerstats(
          useridPlayer2,
          xpPlayer2,
          levelPlayer2,
          gradePlayer2,
          auraPlayer2,
          winsPlayer2,
          losesPlayer2,
          playedPlayer2,
          hoursPlayedPlayer2,
          dodgePlayer2,
          stealPlayer2,
          winStreakPlayer2,
          frozenPlayer2,
          killCountPlayer2,
          dailyStreakPlayer2,
          matchesWonWithAll3DragonPlayer2,
          lossStreakPlayer2,
          criticalKillsPlayer2
        );
        console.log("Ya final status ha update ka:", updatePlayer2Stats);
        console.log("****************   Final return *****************");
        if (updatePlayer2Stats.status == true) {
          return res.status(200).send({
            success: true,
            message: "Data statsUpdate ",
          });
        }
      } else {
        var updatePlayer2Stats = await updatePlayerstats(
          useridPlayer2,
          xpPlayer2,
          levelPlayer2,
          gradePlayer2,
          auraPlayer2,
          winsPlayer2,
          losesPlayer2,
          playedPlayer2,
          hoursPlayedPlayer2,
          dodgePlayer2,
          stealPlayer2,
          winStreakPlayer2,
          frozenPlayer2,
          killCountPlayer2,
          dailyStreakPlayer2,
          matchesWonWithAll3DragonPlayer2,
          lossStreakPlayer2,
          criticalKillsPlayer2
        );

        console.log("****************   Final return *****************");
        if (updatePlayer2Stats.status == true) {
          return res.status(200).send({
            success: true,
            message: "Data statsUpdate ",
          });
        }
      }
    } catch (error) {
      console.log("ERRR :", error.message);
      next(error);
    }
  },
  getbattles: async (req, res, next) => {
    try {
      let userid = req.user.id;
      var battlehistory = await models.User.findAll({
        where: {
          id: userid,
        },
        include: [
          models.PlayerStat,
          {
            model: models.BattleStats,
            include: [
              {
                model: models.Battle,
                include: [
                  {
                    model: models.Territories,
                  },
                ],
              },
            ],
          },
        ],
      });

      // console.log("battle stats ", battlehistory[0].BattleStats);
      var finalArray = [];
      for (let battle of battlehistory[0].BattleStats) {
        console.log(" Battle ****************** ", battle.BattleId);
        let opponentUser = await models.BattleStats.findAll({
          where: {
            BattleId: battle.BattleId,
            UserId: {
              [Op.ne]: userid,
            },
          },
        });
        //return res.json(opponentUser[0.);
        // console.log("OOPOPOPOPOPPOPOPOP++++++++++++:", opponentUser[0].UserId);
        var opponentUserDetails = await models.User.findOne({
          where: {
            id: opponentUser[0].UserId,
          },
        });

        let battlesdetails = {
          battleId: battle.BattleId,
          territoryName: battle.Battle.Territory.name,
          territory: battle.Battle.Territory.imageurl,
          winlose: battle.winlose,
          OpponentName: opponentUserDetails.username,
          Date: battle.Battle.createdAt,
          Duration: battle.Battle.duration,
        };
        finalArray.push(battlesdetails);
      }
      if (battlehistory)
        return res.json({
          data: finalArray,
          error: null,
          success: true,
        });
    } catch (error) {
      console.log("Error  ", error);
      next(error);
    }
  },
};
