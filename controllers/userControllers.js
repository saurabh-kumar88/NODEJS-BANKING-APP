require('dotenv/config');
const { validationResult } = require("express-validator");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../emails/transport");
const { emailConfirmationTemplate } = require("../emails/templates");
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
            else res.send("Email has been sended " + info.response);
        });

        
    } catch(err) {
        next(err);
    }

};

const accountActivation = async (req, res) => {
    const token  = req.params.token;

    console.log('____________________________________')
    console.log( req.params.token )
    res.send('<h1>Welcome Back</h1>');

    // try {
    //     const user = await Users.findOne({ token : token });
    //     if(!user) return res.redirect("/");
    //     const expireIn = 1000 * 60 * 60 * 60 * 24;

    //     if((Date.now() - user.createdAt) > expireIn) {
    //         await user.remove();
    //         return res.redirect("/");
    //     }

    //     user.active = true;
    //     await user.save();
    //     return res.send("<h1>Welcome Back!</h1>");
        
    // } catch (error) {
    //     res.sendStatus(404);
    // }
}


// login
const login = async (req, res ) => {  
    res.render('login');
};

// handleLogin  
const handleLogin = async ( req, res ) => {
    res.send('logged In');
    console.log(req.body);
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