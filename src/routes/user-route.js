

const router = require("express").Router();

const {
  registerUserController,loginUserController,verificationEmail,refreshTokens,forgotPasswordController,userimgcontroller,verifyEmailForgetPassword


} = require("../controller/user.controller");

router.patch("/img",userimgcontroller)
router.patch("/forgotpassword",forgotPasswordController);
router.get("/forgotpassword",verifyEmailForgetPassword)

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *          username:
 *            type: string 
 *          email:
 *            type: string
 *          confirmpassword:
 *            type: string
 *          password:
 *            type: string
 *          walletaddress:
 *            type: string 
*/







/**
 * @swagger
 * /api/user/register:
 *   post:
 *    summary: Register New User.
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */

router.post(
  "/register",
  registerUserController
);


/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogIn:
 *       type: object
 *       properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
*/


/**
 * @swagger
 * components:
 *   schemas:
 *     RevokeToken:
 *       type: object
 *       properties:
 *          token:
 *            type: string
*/



/**
 * @swagger
 * /api/user/login:
 *   post:
 *    summary: Login User.
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserLogIn'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.post(
  "/login",
  loginUserController

);

/**
 * @swagger
 * /api/user/token:
 *   post:
 *    summary: Revoke Token.
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RevokeToken'      # <-------
 *    responses:
 *      '201':
 *        description: Created
 */
router.post("/token", refreshTokens);



/**
 * @swagger
 * /api/user/verify/{verifyToken}:
 *   get:
 *    summary: For Verification.
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: verifyToken
 *         type:string
 *        required: true
 *        description: Enter the verification Token
 *    responses:
 *      '201':
 *        description: Created
 */
 router.get("/verify", verificationEmail);


module.exports = router;







