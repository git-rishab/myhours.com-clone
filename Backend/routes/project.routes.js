const express = require("express");
const {ProjectModel} = require("../model/project.model");

const projectRoute = express.Router();

// Get all project detils by sending specifc ID
projectRoute.get("/",async(req,res)=>{
    try {
        let fetchedData = await ProjectModel.find({userID:req.body.userID});
        res.send({"ok":true,"data":fetchedData});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went Wrong with server"});
    }
})

// Create Projects
projectRoute.post("/create",async(req,res)=>{
    let data = new ProjectModel(req.body);
    await data.save();
    res.send({"ok":true,"msg":"Project Added Successfully"});
})

// Delete Project
projectRoute.delete("/delete",async(req,res)=>{
    try {
        await ProjectModel.findByIdAndDelete({_id:req.body._id});
        res.send({"ok":true,"msg":"Project has been Deleted"});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server","err":error});
    }
})

// Update Project
projectRoute.patch("/update",async(req,res)=>{
    try {
        await ProjectModel.findByIdAndUpdate({_id:req.body._id},req.body);
        res.send({"ok":true,"msg":"Details Updated Successfully"});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server","err":error});
    }
})

// Checking if logged in
projectRoute.get("/checking",(req,res)=>{
    res.send({"ok":true,"msg":"Logged in"});
})

module.exports = {
    projectRoute
}