const { validationResult } = require("express-validator");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const Users = require("../models/users");

// signup
const signup = (req, res ) => {  
    res.render('signup');
};

// handle signup
const handleSignup = async (req, res, next ) => {  
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const err = new Error(errArray[0].msg);
            err.statusCode = 422;
            err.data = errArray;
            throw err;
        }

        const existingUser = await Users.findOne({ email: email });
        if (existingUser) {
            // const err = new Error("E-Mail address already exists.");
            // err.statusCode = 422;
            throw "E-Mail address already exists.";
            
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const activationToken = (await promisify(randomBytes)(20)).toString("hex");
        const user = new Users({
        email: email,
        password: hashedPassword,
        name: name,
        activationToken: activationToken,
        });
        const savedUser = await user.save();

        res.status(201).json({
            message: "User successfully created.",
            userId: savedUser._id,
          });
        
    } catch(err) {
        next(err);
    }

    



};


// login
const login = (req, res ) => {  
    res.render('login');
};

// handleLogin  
const handleLogin = ( req, res ) => {
    res.send('logged In');
    console.log(req.body);
};

module.exports = {
    login,
    handleLogin,
    signup,
    handleSignup,
    
};