// Packages
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

// Import model
const Reminders  = require('../models/reminder_model');
const Users = Reminders.ReminderUser;

// Import controllers
const controller = require('../controllers/user');

// Add new user
router.post('/', [
    check('username')
        .notEmpty()
        .withMessage('Username cannot be empty')
        .trim()
        .isLength({min: 5})
        .withMessage('Username must be at least 5 characters'),
    check('password')
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
        })
        .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol'),
    check('passwordVerify')
        .notEmpty()
        .withMessage('Confirmation password cannot be empty')
        .custom(async (passwordVerify, { req }) => {
            if (passwordVerify !== req.body.password){
                throw new Error('Confirmation password does not match')
            };
        }),
    check('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async email => {
            return await Users.findOne({email}).then(user => {
                if(user){
                    return Promise.reject('An account with this email already exists.');
                }
            });
        })
], controller.createUser);

// Login
router.post('/login', [
    check('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .custom(async (email, { req }) => {
            user = await Users.findOne({email});
            // Check if email exists
            if (!user) {
                throw new Error('Wrong email or password');
            }
            
            // Check if the password is correct
            const passwordCorrect = await bcrypt.compare(req.body.password, user.passwordHash);
            if (!passwordCorrect){
                throw new Error('Wrong email or password');
            }
        }),
    check('password')
        .notEmpty()
        .withMessage('Password cannot be empty')

], controller.loginUser);

// Logout
router.get('/logout', controller.logoutUser);

// Check if user is logged in
router.get("/loggedIn", controller.checkLoggedIn);

// Forgot password
router.post("/forgotpassword", [
    check('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .custom(email => {
            return Users.findOne({email}).then(user => {
                if(!user){
                    return Promise.reject('Invalid email');
                }
            });
        })
], controller.forgotPassword);

// Reset password
router.put("/resetpassword/:resetToken", [
    check('password')
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
        })
        .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol')
        .custom(async (password, { req }) => {
            if (password !== req.body.passwordVerify){
                throw new Error('Confirmation password does not match')
            };
        }),
    check('passwordVerify')
        .notEmpty()
        .withMessage('Confirmation password cannot be empty'),
], controller.resetPassword);

module.exports = router;