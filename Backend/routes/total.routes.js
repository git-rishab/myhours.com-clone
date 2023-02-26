const express = require("express");
const {TotalModel} = require("../model/total.model");

const totalRoute = express.Router();

// For Admin 
totalRoute.post("/",async(req,res)=>{
    try {
        let data = await TotalModel.find({email:req.body.email});
        res.send({"ok":true,"msg":"Details Updated Successfully",data:data[0]});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server",error});
    }
})

// For Member
totalRoute.post("/totals",async(req,res)=>{
    try {
        let data = await TotalModel.find({userID:req.body.userID});
        res.send({"ok":true,"msg":"Details Updated Successfully",data:data[0]});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server",error});
    }
})

totalRoute.patch("/update",async (req,res)=>{
    try {
        await TotalModel.findByIdAndUpdate({_id:req.body.id},req.body);
        res.send({"ok":true,"msg":"Details Updated Successfully"});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server","err":error});
    }
})

module.exports = {
    totalRoute
}