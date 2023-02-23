const express = require("express");
const {TimeModel} = require("../model/time.model");

const timeRoute = express.Router();

// Get all time detils by sending specifc ID
timeRoute.get("/",async(req,res)=>{
    let data = await TimeModel.find(req.body);
    res.send(data[0]);
})

// Update Time
timeRoute.patch("/update",async(req,res)=>{
    try {
        let databaseData = await TimeModel.find({userID:req.body.userID});
        databaseData[0].data.push(req.body.data);
        await TimeModel.updateOne({userID:req.body.userID},{$set:{data:databaseData}});
        res.send({"ok":true,"msg":"Updated Successfully"});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong"});
    }
})

module.exports = {
    timeRoute
}