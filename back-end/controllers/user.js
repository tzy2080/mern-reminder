// Packages
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult } = require('express-validator');
require("dotenv").config();

// Import model
const Reminders  = require('../models/reminder_model');
const Users = Reminders.ReminderUser;

// Send email function
const sendEmail = require('../utils/sendEmail');

// Json web token
const jwt = require('jsonwebtoken');

// Add new user
const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res
                .status(400)
                .json({ errors: errors.array() });
        }

        const {username, email, password} = req.body;

        // Hashing the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Save a new user account to the db
        const newUser = new Users({
            username,
            email,
            passwordHash,
            resetPasswordToken: undefined,
            resetPasswordExpire: undefined
        });

        const savedUser = await newUser.save();

        // Log the user in
        const token = jwt.sign(
        {
            user: savedUser._id
        }, 
        process.env.JWT_SECRET_KEY
        );

        // Send the token in a HTTP-only cookie
        res
            .cookie("token", token, {
            httpOnly: true
            })
            .send();

    }   catch (error) {
        res.status(500).send();
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res
                .status(400)
                .json({ errors: errors.array() });
        }

        const { email } = req.body;
        // Find user
        const existingUser =  await Users.findOne({email});

        // Sign token
        const token = jwt.sign(
            {
                user: existingUser._id
            }, 
            process.env.JWT_SECRET_KEY
            );

        // Send the token in a HTTP-only cookie
        res
            .cookie("token", token, {
            httpOnly: true
            })
            .send();

    } catch (error) {
        res.status(500).send();
    }
};

// Logout
const logoutUser = async (req, res) => {
    res
        .cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
        })
        .send();
};

// Check if user is logged in
const checkLoggedIn = async (req, res) => {
    try{
        const token = req.cookies.token;

        // Check if token exists
        if (!token){
            return res.json(false);
        };

        // Validate token
        jwt.verify(token, process.env.JWT_SECRET_KEY);

        res.send(true);
    } catch (error) {
        res.json(false);
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res
            .status(400)
            .json({ errors: errors.array() });
    }

    const {email} = req.body;

    try {
        const user = await Users.findOne({email});

        // Create reset password token
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Create token expiry date
        user.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            });

            res.status(200).json({ success: true, data: "Email Sent"});
        } catch(error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(500).json({ errorMessage: "Email could not be sent"});
        }
    } catch (error) {
        res.status(500).send();
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res
            .status(400)
            .json({ errors: errors.array() });
    }

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    const { password } = req.body;

    // Hashing the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    try {
        const user = await Users.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ errorMessage: "Invalid Reset Token"});
        }

        user.passwordHash = passwordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            sucess: true,
            data: "Password reset Success"});
    } catch (error) {
        res.status(500).send();
    };
};

module.exports = { createUser, loginUser, logoutUser, checkLoggedIn, forgotPassword, resetPassword };