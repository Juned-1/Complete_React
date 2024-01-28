//separating different routes
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authenticationController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
router.patch(
  '/updatemydetails',
  authController.protect,
  userController.updateMyData
);
router.delete(
  '/deletemyaccount',
  authController.protect,
  userController.deleteMyAccount
);
//Following are REST architecture
router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
//one export using module.exports

module.exports = router;
