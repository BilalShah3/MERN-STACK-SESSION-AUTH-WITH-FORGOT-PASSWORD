const express = require('express')
const router = express.Router()
const userController = require('../controllers/usercontroller')
const authenticate = require("../middleware/authenticate");

router.post('/register', userController.signup)
router.post(`/login`, userController.login)
router.delete('/logout',authenticate, userController.signout)
router.get('/isAuth',authenticate, userController.isloggedin)
//send email link for reset password
router.post('/sendpasswordlink', userController.sendpasswordlink)
// verify user for forgot password time
router.get("/resetpassword/:id/:token", userController.verifyuserforgotpassword);
// change password
router.post("/:id/:token",userController.changepassword)

module.exports = router