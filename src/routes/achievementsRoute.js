const router = require("express").Router();
const auth = require("../middleware/MiddleWareCon");
const verifyuser = require("../middleware/verifyUser");
const {
  addachievements,
  addAchievementsFromJSON,
  getAllachievements,
  findAchivementById,
  addUserAchievements,
  getuserAchievements,
  claimAchievements,
  getbattlestats,
  battle,
} = require("../controller/achievementsController");
// router.post("/json",addAchievementsFromJSON);
// router.post("/add",addachievements);

// router.post("/",addUserAchievements);

// router.get("/",getAllachievements);
router.post("/battle", battle);
router.get("/battle", auth, getbattlestats);
/**
 * @swagger
 * components:
 *   schemas:
 *     ClaimAchievements:
 *       type: object
 *       properties:
 *          achievementsId:
 *            type: integer
 *          claim:
 *            type: boolean
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Achievements:
 *       type: object
 *       properties:
 *          achievementsId:
 *            type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     newAchievements:
 *       type: object
 *       properties:
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          xp:
 *            type: integer
 *          aura:
 *            type: integer
 *          amount:
 *            type: string
 *          typeOfAchievements:
 *            type: string
 */

/**
 * @swagger
 * tags:
 *   name: Achievements
 *   description: Call Achievements  API
 */

/**
 * @swagger
 * tags:
 *   name: NoToken
 *   description: These api dont require JWT token
 */

/**
 * @swagger
 * /api/achievements/json:
 *   post:
 *    summary: Add All Achievement from JSON.
 *    tags: [NoToken]
 *    responses:
 *      '201':
 *        description: Created
 */
router.post("/json", addAchievementsFromJSON);
/**
 * @swagger
 * /api/achievements/add:
 *   post:
 *    summary: Add New Achievement.
 *    tags: [NoToken]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/newAchievements'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.post("/add", addachievements);

/**
 * @swagger
 * /api/achievements:
 *   post:
 *    summary: Unlock new Achievements for user
 *    tags: [Achievements]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Achievements'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.post("/", auth, addUserAchievements);

/**
 * @swagger
 * /api/achievements:
 *   patch:
 *    summary: Claim User Achievements
 *    tags: [Achievements]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ClaimAchievements'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.patch("/", auth, claimAchievements);

/**
 * @swagger
 * /api/achievements/user:
 *   get:
 *    summary: Get  All Achievements of User.
 *    tags: [Achievements]
 *    responses:
 *      '201':
 *        description: Created
 */
router.get("/user", auth, getuserAchievements);

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Returns the list of all the Achievements
 *     tags: [NoToken]
 *     responses:
 *       200:
 *         description: The list of the Achivements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/", getAllachievements);

/**
 * @swagger
 * /api/achievements/{id}:
 *   get:
 *     summary: Get the Achievement by id
 *     tags: [NoToken]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Achievement id
 *     responses:
 *       200:
 *         description: The Achievement description by id
 *         contens:
 *           application/json:
 *             schema:
 *              type: array
 *
 *       404:
 *         description: The book was not found
 */
router.get("/:id", findAchivementById);

module.exports = router;
