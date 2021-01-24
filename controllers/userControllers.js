require('dotenv/config');
const { validationResult } = require("express-validator");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../emails/transport");
const { emailConfirmationTemplate } = require("../emails/templates");
const Users = require("../models/users");
const { type } = require('os');

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
        // if (existingUser) {
        //     // const err = new Error("E-Mail address already exists.");
        //     // err.statusCode = 422;
        //     throw "E-Mail address already exists.";
            
        // }

        const hashedPassword = await bcrypt.hash(password, 12);
        const activationToken = (await promisify(randomBytes)(20)).toString("hex");
        const user = new Users({
        email: email,
        password: hashedPassword,
        name: name,
        activationToken: activationToken,
        });
        const savedUser = await user.save();

        // res.status(201).json({
        //     message: "User successfully created.",
        //     userId: savedUser._id,
        //   });
        
        await transporter.sendMail({
            from : process.env.HOST_EMAIL,
            to : savedUser.email,
            subject :"Confirm your email",
            html:emailConfirmationTemplate(savedUser.activationToken),
        },
        function(err, info){
            if(err) res.send(err);
            else res.send(`<h1>An varification link has been sended to your email id ${user.email}</h1> <br>
            <p>Please varify your email</p>`);
        });

        
    } catch(err) {
        next(err);
    }

};

const accountActivation = async (req, res, next) => {
    const activationToken  = req.params.token;
    
    try {
        const user = await Users.findOne({ activationToken : activationToken });
        
        if(!user){
            const err = new Error('Invalid activation code');
            err.statusCode = 422;
            throw err;
        };
        const expireIn = 24 * 60 * 60 * 1000; // one day or 3600 seconds

        if((Date.now() - user.expires) > expireIn) {
            await user.remove();
            return res.redirect('/signup');
        }

        user.confirmed = true;
        user.activationToken = null
        const savedUser =  await user.save();

        // // Automatically log in user after registration
        // const token = jwt.sign({ 
        //     userId: savedUser._id.toString() },
        //     process.env.JWT_KEY
        // );
  
        // // Set cookie in the browser to store authentication state
        // const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     maxAge: maxAge,
        //     domain: process.env.DOMAIN,
        // });
  
        return res.status(201).json({
            message : "Account have been activated!",
            userId : savedUser._id.toString() 
        });
        
    } catch (error) {
        next(error)
    }
}


// login
const login = async (req, res, next) => {  
    res.render('login');
};

// handleLogin  
const handleLogin = async ( req, res, next ) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log("______________________________")
        console.log(email)
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const err = new Error("Input validation failed.");
          err.statusCode = 422;
          err.data = errors.array();
          throw err;
        }
    
        const user = await Users.findOne({ email: "ykingssaurabh@gmail.com" });
        if (!user) {
          const err = new Error("Incorrect email");
          err.statusCode = 404;
          throw err;
        }
    
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          const err = new Error("Incorrect password.");
          err.statusCode = 401;
          throw err;
        }
    
        const token = jwt.sign(
          { userId: user._id.toString() },
          process.env.JWT_KEY
        );
    
        // Set cookie in the browser to store authentication state
        const maxAge = 1000 * 60 * 60; // 1 hour
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: maxAge,
          domain: process.env.DOMAIN,
        });
    
        res.status(201).json({
          message: "User successfully logged in.",
          token: token,
          userId: user._id.toString(),
        });
      } catch (err) {
        next(err);
      }
};

// user dashboard
const dashboard = async (req, res) => {

    if( !req.session.user || !req.session.user.active ) {
        return res.redirect("/");
    }else{
        res.send("<h1>Welcome back</h1>");
    }
    
 }



module.exports = {
    login,
    handleLogin,
    signup,
    handleSignup,
    accountActivation,
    dashboard,
    
};