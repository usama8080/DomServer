require("dotenv").config();
const models = require("../../models/index");
const ankle = require("../../data/ankle.json");
const baseHP = require("../../data/base_HP.json");
const bracelet = require("../../data/bracelet.json");
const eyes = require("../../data/eyes.json");
const head = require("../../data/head.json");
const horns = require("../../data/horns.json");
const necklace = require("../../data/necklace.json");
const shoulder = require("../../data/shoulder.json");
const tailendsDEF = require("../../data/tailends_def.json");
const tail = require("../../data/tails.json");
const teeth = require("../../data/teeth.json");
const wings = require("../../data/wings.json");
const attacks = require("../../data/specialAttack.json");
const skills = require("../../data/skills.json");
const metadata = require("../../data/metadata.json");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = require("sequelize");

module.exports = {
  nft: async (req, res, next) => {
    try {
      for (let i = 0; i < 5555; i++) {
        let item = metadata[i];
        // console.log("ID :saadas::", i);
        let ankleDmg = ankle.find(
          (o) => o.Ankle == `${item.attributes[0].value}`
        );
        let baseHp = baseHP.find(
          (o) => o.Bases == `${item.attributes[1].value}`
        );

        let braceletDmg = bracelet.find(
          (o) => o.Bracelet == `${item.attributes[2].value}`
        );
        let eyeDmg = eyes.find((o) => o.Eyes === `${item.attributes[3].value}`);
        let headDmg = head.find((o) => o.Head == `${item.attributes[4].value}`);
        let hornsDmg = horns.find(
          (o) => o.Horns == `${item.attributes[5].value}`
        );
        let necklaceDmg = necklace.find(
          (o) => o.Necklace == `${item.attributes[6].value}`
        );
        let shoulderDmg = shoulder.find(
          (o) => o.Shoulder == `${item.attributes[7].value}`
        );
        let tailDmg = tail.find(
          (o) => o.Tailends == `${item.attributes[8].value}`
        );
        let tailendsDef = tailendsDEF.find(
          (o) => o.Tails == `${item.attributes[9].value}`
        );
        let teethDmg = teeth.find(
          (o) => o.Teeth == `${item.attributes[10].value}`
        );
        let wingsDef = wings.find(
          (o) => o.Wings == `${item.attributes[11].value}`
        );

        let specialAttack = attacks.find(
          (o) => o.class == `${item.attributes[12].value}`
        );

        console.log(
          ankleDmg,
          braceletDmg,
          eyeDmg,
          headDmg,
          hornsDmg,
          necklaceDmg,
          shoulderDmg,
          tailDmg,
          teethDmg
        );

        let totalDamage =
          parseInt(ankleDmg.Damage) +
          parseInt(braceletDmg.Damage) +
          parseInt(eyeDmg.Damage) +
          parseInt(headDmg.Damage) +
          parseInt(hornsDmg.Damage) +
          parseInt(necklaceDmg.Damage) +
          parseInt(shoulderDmg.Damage) +
          parseInt(tailDmg.Damage) +
          parseInt(teethDmg.Damage);

        console.log(tailendsDef, wingsDef);

        let totalDefence =
          parseInt(tailendsDef.Defence) + parseInt(wingsDef.Defence);
        //  console.log("HP :::::::",baseHp.HP)
        let newNft = await models.Dragons.create({
          dragonid: i,
          description: item.description,
          name: item.name,
          image: item.image,
          ankle: item.attributes[0].value,
          dragon: item.attributes[1].value,
          bracelet: item.attributes[2].value,
          eyes: item.attributes[3].value,
          head: item.attributes[4].value,
          horns: item.attributes[5].value,
          necklace: item.attributes[6].value,
          shoulder: item.attributes[7].value,
          tail: item.attributes[8].value,
          tailends: item.attributes[9].value,
          teeth: item.attributes[10].value,
          wings: item.attributes[11].value,
          background: item.attributes[12].value,
          class: item.attributes[12].value,
          category: "wyrmling",
          ankleDmg: ankleDmg.Damage,
          hp: baseHp.HP,
          braceletDmg: braceletDmg.Damage,
          eyeDmg: eyeDmg.Damage,
          headDmg: headDmg.Damage,
          hornsDmg: hornsDmg.Damage,
          necklaceDmg: necklaceDmg.Damage,
          shoulderDmg: shoulderDmg.Damage,
          tailDmg: tailDmg.Damage,
          tailendsDef: tailendsDef.Defence,
          teethDmg: teethDmg.Damage,
          wingsDef: wingsDef.Defence,
          specialAttack: specialAttack.attack,
          damage: totalDamage,
          defence: totalDefence,
        });
      }
      return res.json({
        data: "Dragons added",
        error: null,
        success: true,
      });
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },

  getDragonByid: async (req, res, next) => {
    try {
      const id = parseInt(req.body.id);
      let dragon = await models.Dragons.findOne({
        where: { dragonid: id },
      });
      let dragon_skills = await models.Skill.findAll({
        where: { dragonClass: dragon.dragon },
      });
      let outibj = {
        dragonid: dragon.dragonid,
        description: dragon.description,
        name: dragon.name,
        image: dragon.iamage,
        ankle: dragon.ankle,
        dragon: dragon.dragon,
        bracelet: dragon.bracelet,
        eyes: dragon.eyes,
        head: dragon.head,
        horns: dragon.horns,
        necklace: dragon.necklace,
        shoulder: dragon.shoulder,
        tail: dragon.tail,
        tailends: dragon.tailends,
        teeth: dragon.teeth,
        wings: dragon.wings,
        background: dragon.background,
        class: dragon.class,
        category: dragon.category,
        ankleDmg: dragon.ankleDmg,
        hp: dragon.hp,
        braceletDmg: dragon.braceletDmg,
        eyeDmg: dragon.eyeDmg,
        tailDmg: dragon.tailDmg,
        headDmg: dragon.headDmg,
        hornsDmg: dragon.hornsDmg,
        necklaceDmg: dragon.necklaceDmg,
        shoulderDmg: dragon.shoulderDmg,
        tailDmg: dragon.tailDmg,
        tailendsDef: dragon.tailendsDef,
        teethDmg: dragon.teethDmg,
        wingsDef: dragon.wingsDef,
        specialAttack: dragon.specialAttack,
        damage: dragon.damage,
        defence: dragon.defence,

        Skills: dragon_skills,
      };
      if (dragon) {
        return res.json({
          data: outibj.Skills,
          error: null,
          success: true,
        });
      }
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },
};
