const express = require("express");
const {TimeModel} = require("../model/time.model");

const timeRoute = express.Router();

// Get all time detils by sending specifc ID
timeRoute.post("/",async(req,res)=>{
    let data = await TimeModel.find(req.body);
    res.send(data);
})

// Create Time
timeRoute.post("/create",async(req,res)=>{
    let data = new TimeModel(req.body);
    await data.save();
    res.send({"ok":true,"msg":"Time added successfully"});
})

module.exports = {
    timeRoute
}