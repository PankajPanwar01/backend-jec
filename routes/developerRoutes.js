const express = require("express");
const route = express.Router();
const Developer = require('../models/developer');
const passport = require('../auth')
const {jwtAuthMiddleware, generateToken} = require('../jwt')
const bcrypt = require('bcrypt');

const authmid = passport.authenticate('local', {session:false})

// create developer
route.post("/signup", async (req, res) => {

    try{
        const data = req.body;

        const newDeveloper = new Developer(data);

        const response = await newDeveloper.save();

        const payload = {
            username:response.username,
            email:response.email
        };

        const token = generateToken(payload);
        console.log("Token is", token);

        res.status(200).json({
            response:response,
            token:token
        })

        console.log("Data saved!");

        // res.status(200).json(response);

    } catch(error){
        console.log(error)
        res.status(500).json({msg:"Internal Server Error"});
    }
});


// Login Api

route.post('/login', async (req ,res)=>{

    try{

        const {username , password} = req.body;

        const user = await Developer.findOne({username : username});

        if(!user || !( bcrypt.compare(password, user.password))){

            res.status(401).json({error:"Invalid username or password"});
        }
        
        const payload = {
            user
        };

        const token = generateToken(payload);
        console.log("Token is", token);
        res.status(200).json({
            token: token,
        });


    } catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server Error"});
    }

});



// get all the developers
route.get("/", async (req, res) => {

    try{

        const data = await Developer.find();
        console.log("Data fectched");
        res.status(200).json(data);

    } catch(error){
        console.log(error)
        res.status(500).json({msg:"Internal Server Error"})
    }
});


// get developer by id
// route.get("/:id", (req, res) => {});


// get developer by domain
route.get("/:techType",jwtAuthMiddleware, async (req, res) => {

    try{
        const techType = req.params.techType;
    if(techType === "fullstack" || techType === "frontend" || techType === "backend"){
        const response = await Developer.find({work : techType});

        console.log("Techtype data fetched");
        res.status(200).json(response);
    }else{
        res.status(404).json({msg:"Invalid Tech"})
    }
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Internal Server Error"})
    }
});


// update developer
route.put("/:id", async (req, res) => {

    try{
        const developerId = req.params.id;
    const updatedDeveloper = req.body;

    const response = await Developer.findByIdAndUpdate(developerId, updatedDeveloper, {
        new:true, 
        runValidators:true
    })

    if(!response){
        res.status(404).json({msg:"Developer not Found"})
    };

    console.log("Data updated");

    res.status(200).json(response)
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Internal Server Error"})
    }
});


// delete developer
route.delete("/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        const response = await Developer.findByIdAndDelete(studentId);

        if(!response){
            res.status(404).json({msg:"student not found"})
        }

        res.status(200).json({msg:"Developer deleted successfull"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Internal Server Error"})
    }
});

module.exports = route;
