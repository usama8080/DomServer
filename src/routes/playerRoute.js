const router = require("express").Router();
const auth = require("../middleware/MiddleWareCon");

const {
  updatePlayer,
  findPlayserStatsById,
  findKilledBy,
  killedby,
  findKilled,
  killed,
  usedSkills,
  updateAllStats,
  addTerritories,
  addInventory,
  getInventory,
  newbattle,
  getbattlestats,
  getbattles,
} = require("../controller/playerController");

/**
 * @swagger
 * /api/player/Inventory:
 *   post:
 *     summary: Add All the default Achievements , Skills and Territories
 *     tags: [NoToken]
 *     responses:
 *       200:
 *         description: Add All the default Achievements , Skills and Territories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post("/Inventory", addInventory);
/**
 * @swagger
 * /api/player/Inventory:
 *   get:
 *     summary: Add All the default Achievements , Skills and Territories
 *     tags: [NoToken]
 *     responses:
 *       200:
 *         description: Add All the default Achievements , Skills and Territories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/Inventory", getInventory);

router.patch("/skill", auth, usedSkills);
/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       properties:
 *          xp:
 *            type: integer
 *          level:
 *            type: integer
 *          grade:
 *            type: string
 *          aura:
 *            type: integer
 *          wins:
 *            type: integer
 *          loses:
 *            type: integer
 *          played:
 *            type: integer
 *          hoursPlayed:
 *            type: integer
 *          dodge:
 *            type: integer
 *          steal:
 *            type: integer
 *          frozen:
 *            type: integer
 *          killCount:
 *            type: integer
 *          dailyStreak:
 *            type: integer
 *          matchesWonWithAll3Dragon:
 *            type: integer
 *          lossStreak:
 *            type: string
 *          territories:
 *            type: integer
 *          killedby:
 *            type: object
 *            item:
 *          killed:
 *            type:integer
 *          territory:
 *            type: object
 *            item:
 *          id:
 *            type:integer
 *
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayerStatUpdate:
 *       type: object
 *       properties:
 *          xp:
 *            type: integer
 *          level:
 *            type: integer
 *          grade:
 *            type: string
 *          aura:
 *            type: integer
 *          wins:
 *            type: integer
 *          winStreak:
 *            type: integer
 *          loses:
 *            type: integer
 *          played:
 *            type: integer
 *          hoursPlayed:
 *            type: integer
 *          dodge:
 *            type: integer
 *          steal:
 *            type: integer
 *          frozen:
 *            type: integer
 *          killCount:
 *            type: integer
 *          dailyStreak:
 *            type: integer
 *          matchesWonWithAll3Dragon:
 *            type: integer
 *          lossStreak:
 *            type: string
 *          KilledBies:
 *            type: object
 *            properties:
 *               killedbyid:
 *                type: integer
 *               count:
 *                type: integer
 *          Killed:
 *            type: object
 *            properties:
 *               killedid:
 *                type: integer
 *               count:
 *                type: integer
 *          SkillsUsed:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                SkillId:
 *                  type: integer
 *                count:
 *                  type: integer
 *          Territory:
 *            type: object
 *            properties:
 *               id:
 *                type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Battle:
 *       type: object
 *       properties:
 *          common:
 *            type: object
 *            properties:
 *                 duration:
 *                  type: integer
 *                 territory:
 *                   type: integer
 *                 win:
 *                   type: string
 *                 loose:
 *                   type: integer
 *          BattlestatsPlayer1:
 *            type: object
 *            properties:
 *               type:
 *                type: integer
 *               normalAttacks:
 *                type: integer
 *               specialAttacks:
 *                type: integer
 *               criticalAttacks:
 *                type: integer
 *          dragon:
 *           type: array
 *           items:
 *            type: integer
 *          achievements:
 *           type: array
 *           items:
 *            type: integer
 *          skills:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                SkillId:
 *                  type: integer
 *                count:
 *                  type: integer
 *          playerstatsPlayer1:
 *            type: object
 *            properties:
 *               playerid:
 *                 type: integer
 *               xp:
 *                 type: integer
 *               level:
 *                 type: integer
 *               grade:
 *                 type: string
 *               aura:
 *                 type: integer
 *               wins:
 *                 type: integer
 *               winStreak:
 *                type: integer
 *               loses:
 *                 type: integer
 *               played:
 *                type: integer
 *               hoursPlayed:
 *                 type: integer
 *               dodge:
 *                 type: integer
 *               steal:
 *                 type: integer
 *               frozen:
 *                 type: integer
 *               killCount:
 *                 type: integer
 *               dailyStreak:
 *                 type: integer
 *               matchesWonWithAll3Dragon:
 *                 type: integer
 *               lossStreak:
 *                 type: integer
 *               criticalKills:
 *                 type: integer
 *          BattlestatsPlayer2:
 *            type: object
 *          playerstatsPlayer2:
 *            type: object
 *       
 *                 
 *               
       
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     KilledBy:
 *       type: object
 *       properties:
 *          killedid:
 *            type: integer
 *          count:
 *            type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Killed:
 *       type: object
 *       properties:
 *          killedid:
 *            type: integer
 *          count:
 *            type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UsedSkills:
 *       type: object
 *       properties:
 *          count:
 *            type: integer
 *          skillid:
 *            type: integer
 */
/**
 * @swagger
 * tags:
 *   name: NoToken
 *   description: These api dont require JWT token
 */

// /**
//  * @swagger
//  * /api/player/territories:
//  *   post:
//  *     summary: Add All the default territories
//  *     tags: [NoToken]
//  *     responses:
//  *       200:
//  *         description: Add All the default territories
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  */
//  router.post("/territories",auth,addTerritories);

/**
 * @swagger
 * /api/player:
 *  patch:
 *    summary: Update the Player by the id
 *    tags: [PlayerStat]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PlayerStatUpdate'
 *    responses:
 *      200:
 *        description: The Player was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PlayerStatUpdate'
 *      404:
 *        description: The Player was not found
 *      500:
 *        description: Some error happened
 */
//router.patch("/",auth,updateAllStats)

router.patch("/", auth, updateAllStats);

/**
 * @swagger
 * /api/player:
 *   get:
 *     summary: Get the Player by id
 *     tags: [PlayerStat]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The Player description by id
 *         contens:
 *           application/json:
 *             schema:
 *              type: array
 *
 *       404:
 *         description: The Player was not found
 */
router.get("/", auth, findPlayserStatsById);

// Killed BY

/**
 * @swagger
 * /api/player/killedby:
 *   patch:
 *    summary: Add Killed By.
 *    tags: [PlayerStat]
 *    security:
 *       - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/KilledBy'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.patch("/killedby", auth, killedby);

/**
 * @swagger
 * /api/player/killedby:
 *   get:
 *     summary: Get the Player killed by id
 *     tags: [PlayerStat]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The Player description killed by id
 *         contens:
 *           application/json:
 *             schema:
 *              type: array
 *
 *       404:
 *         description: The player killed by was not found
 */
router.get("/killedby", auth, findKilledBy);

// Killed

/**
 * @swagger
 * /api/player/killed:
 *   patch:
 *    summary: Add Killed.
 *    tags: [PlayerStat]
 *    security:
 *      - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Killed'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.patch("/killed", auth, killed);
/**
 * @swagger
 * /api/player/killed:
 *   get:
 *     summary: Get the Player killed id
 *     tags: [PlayerStat]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The Player description killed id
 *         contens:
 *           application/json:
 *             schema:
 *              type: array
 *       404:
 *         description: The player killed was not found
 */
router.get("/killed", auth, findKilled);

/**
 * @swagger
 * /api/player/skill:
 *  patch:
 *    summary: Add / Update Skills
 *    tags: [PlayerStat]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UsedSkills'
 *    responses:
 *      200:
 *        description: The Player Skills update / create
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Player'
 *      404:
 *        description: The Player was not found
 *      500:
 *        description: Some error happened
 */
router.patch("/skill", auth, usedSkills);

/**
 * @swagger
 * /api/player/newbattle:
 *   post:
 *    summary: ADD BATTLE STATS.
 *    tags: [PlayerStat]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Battle'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.post("/newbattle", newbattle);

/**
 * @swagger
 * /api/player/battles:
 *   get:
 *     summary: Get the Battles Detals
 *     tags: [PlayerStat]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: All the Battles
 *         contens:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: Battles not found
 */

router.get("/battles", auth, getbattlestats);

/**
 * @swagger
 * /api/player/battlehistory:
 *   get:
 *     summary: Get the Battles Detals
 *     tags: [PlayerStat]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: All the Battles
 *         contens:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: Battles not found
 */

router.get("/battlehistory", auth, getbattles);
module.exports = router;
