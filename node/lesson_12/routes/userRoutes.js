//separating different routes
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authenticationController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//protect all routes after this middleware
router.use(authController.protect); //router is middleware and protect is also middleware, so after login signup etc router always pass to another miuddleware os protect before all other route below it, since middleware are run in a order they are passed
router.patch(
  '/updateMyPassword',
  authController.updatePassword,
);
router.get(
  '/me',
  userController.getMe,
  userController.getUser,
);
router.patch('/updateme', userController.updateMe);
router.delete('/deleteme', userController.deleteMe);
//Following are REST architecture
//All the below route will be executed by only administartor
router.use(authController.restrictTo('admin'));
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
