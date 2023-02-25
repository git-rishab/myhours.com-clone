const express = require("express");
const {MemberModel} = require("../model/member.model");
const {UserModel} = require("../model/user.model");

const memberRoute = express.Router();

// Get all member by sending userID in payload
memberRoute.get("/",async(req,res)=>{
    try {
        let fetchedData = await MemberModel.find({userID:req.body.userID});
        res.send({"ok":true,data:fetchedData});
        
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server"});
    }
})

// Add new Client
memberRoute.post("/create",async(req,res)=>{
    try {
        let check = await UserModel.find({email:req.body.email});
        let check2 = await MemberModel.find({email:req.body.email});
        if(check.length > 0){
            res.send({"ok":false,"msg":"Admin cannot add himself / herself as a team member"});
        } else if(check2.length > 0){
            res.send({"ok":false,"msg":"Team member already exist"});
        } else {
            let data = new MemberModel(req.body);
            await data.save();
            res.send({"ok":true,"msg":"Member Added Successfully"});
        }
        
    } catch (error) {
        res.send({"ok":false,"msg":"Something went Wrong with Server","err":error});
    }
})

// Updating details
memberRoute.patch("/update",async(req,res)=>{
    try {
        await MemberModel.findByIdAndUpdate({_id:req.body._id},req.body);
        res.send({"ok":true,"msg":"Details Updated Successfully"});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server","err":error});
    }
})

// Deleteing Details

memberRoute.delete("/delete",async(req,res)=>{
    try {
        await MemberModel.findByIdAndDelete({_id:req.body._id});
        res.send({"ok":true,"msg":"Member has been removed"});
    } catch (error) {
        res.send({"ok":false,"msg":"Something went wrong with server","err":error});
    }
})

module.exports = {
    memberRoute
}