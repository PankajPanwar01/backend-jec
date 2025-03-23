const express = require("express");
const route = express.Router();
const Developer = require('../models/developer');

// create developer
route.post("/", async (req, res) => {

    try{
        const data = req.body;

        const newDeveloper = new Developer(data);

        const response = await newDeveloper.save();

        console.log("Data saved!");

        res.status(200).json(response);

    } catch(error){
        console.log(error)
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
route.get("/:techType", async (req, res) => {

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
