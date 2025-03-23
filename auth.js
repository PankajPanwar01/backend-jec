const express = require('express');
const passport = require('passport');
const app = express();
const password = require('passport');
const LocalStrategy = require('passport-local');
const Developer = require('./models/developer');
const bcrypt = require('bcrypt');


passport.use(

    new LocalStrategy(async (username , password, done)=>{

        try {
            console.log("recieved", username, password);

            const user = await Developer.findOne({username:username});

            if(!user){
                return done(null , false , {message:"Incorrect username"})
            }

            // const isPasswordMatch = user.password === password ? true : false;

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            
            if (isPasswordMatch) {
                return done(null, user)
            }else{
                return done(null, false, {message:"Incorrect Password"})
            }
            
        } catch (error) {
            done(error);
        }
    })
)

app.use(passport.initialize());

module.exports = passport;