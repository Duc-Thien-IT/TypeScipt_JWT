const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

router.get("/",middlewareController.verifyToken, userController.getAllUsers);
router.get("/:id", middlewareController.verifyToken, userController.getUser);
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

module.exports = router;