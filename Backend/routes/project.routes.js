const express = require("express");
const {ProjectModel} = require("../model/project.model");

const projectRoute = express.Router();

// Get all project detils by sending specifc ID
projectRoute.get("/",async(req,res)=>{
    let data = await ProjectModel.find(req.body);
    res.send(data);
})

// Create Projects
projectRoute.post("/create",async(req,res)=>{
    let data = new ProjectModel(req.body);
    await data.save();
    res.send({"ok":true,"msg":"project added successfully"});
})


// Checking if logged in
projectRoute.get("/checking",(req,res)=>{
    res.send({"ok":true,"msg":"Logged in"});
})

module.exports = {
    projectRoute
}