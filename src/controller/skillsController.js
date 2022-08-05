
const models = require("../../models");
const Sequelize=require("sequelize")


module.exports = {


// get all Skills 
  getSkills: async (req, res, next) => {
      try 
      { 
        let allSkills = await models.Skill.findAll();
        if(!allSkills || allSkills==null)
        {
          throw new Error ("No Achievement found ")
        }
        else
        {
       
          return res.json({
            data: allSkills,
            total:Object.keys(allSkills).length,
            error: null,
            success: true,
          });
        }
        
      } catch (error) {
        console.log("server error", error.message);
        next(error);
      }

    },

    
}
