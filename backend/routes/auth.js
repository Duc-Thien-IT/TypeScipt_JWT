const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.userLogout);

//Refresh
router.post("/refresh", middlewareController.verifyToken, authController.requestRefreshToken);

module.exports = router;