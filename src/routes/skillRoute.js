const router = require("express").Router();
const auth=require("../middleware/MiddleWareCon")
const {

  getSkills
} = require("../controller/skillsController");

/**
  * @swagger
  * tags:
  *   name: NoToken 
  *   description: These api dont require JWT token 
*/


/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Returns the list of all the skills
 *     tags: [NoToken]
 *     responses:
 *       200:
 *         description: The list of the skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
 router.get("/",getSkills);


module.exports = router;

