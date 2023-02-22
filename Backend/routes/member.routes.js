const express = require("express");
const {MemberModel} = require("../model/member.model");

const memberRoute = express.Router();

// Get all member by sending userID in payload
memberRoute.get("/",async(req,res)=>{
    let data = await MemberModel.find(req.body);
    res.send(data);
})

// Add new Client
memberRoute.post("/create",async(req,res)=>{
    let data = new MemberModel(req.body);
    await data.save();
    res.send({"ok":true,"msg":"member added successfully"});
})

module.exports = {
    memberRoute
}