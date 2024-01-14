//separating different routes
const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
//one export using module.exports

module.exports = router;
