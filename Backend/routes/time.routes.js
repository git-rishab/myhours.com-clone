const express = require("express");
const {TimeModel} = require("../model/time.model");

const timeRoute = express.Router();

// Get all time detils by sending specifc ID
timeRoute.get("/",async(req,res)=>{
    let data = await TimeModel.find({userID:req.body.userID});
    res.send({"ok":true,data:data[0].data});
})

// Update Time
timeRoute.patch("/update",async(req,res)=>{
    try {
        let data = await TimeModel.find({email:req.body.data.email});

        await TimeModel.findByIdAndUpdate({_id:data[0]._id},req.body);

        res.send({"ok":true,"msg":"Updated Successfully"});
    } catch (error) {
        console.log(error);
        res.send({"ok":false,"msg":"Something went wrong"});
    }
})

module.exports = {
    timeRoute
}