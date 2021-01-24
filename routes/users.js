var express = require('express');
var router = express.Router();
const { body } = require('express-validator');

var userController = require('../controllers/userControllers');

const emailValidator = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Email Address is not valid.");
const passwordValidator = body("password")
  .trim()
  .isLength({ min: 8 })
  .withMessage("Password has to be 6 chars or more.");
const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("User name is required.");



router.get('/signup', userController.signup );  

// POST /users/signup
router.post('/handle-signup', [ nameValidator,
        passwordValidator,
        emailValidator ], 
        userController.handleSignup );

router.get('/accountActivation/:token', userController.accountActivation );
router.get('/dashboard', userController.dashboard );


router.get('/login', userController.login );
router.post('/login', userController.handleLogin );



module.exports = router;
