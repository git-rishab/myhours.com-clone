const express = require("express");
const {UserModel} = require("../model/user.model");
const {TimeModel} = require("../model/time.model");
const {MemberModel} = require("../model/member.model");
const {TotalModel} = require("../model/total.model");
const jwt = require("jsonwebtoken");


const userRoute = express.Router();


// For resgister
userRoute.post("/register",async(req,res)=>{
    let exist = await UserModel.find({email:req.body.email});

    if(exist.length > 0){
        res.send({"ok":false,"msg":"User Already Exist"});
    } else {
        let data = new UserModel(req.body);

        let createModel = new TotalModel({email:req.body.email,data:{}});
        await createModel.save();

        // Creating time model also along with registration
        let time = new TimeModel({email:req.body.email,data:[]});
        await time.save();
        
        await data.save();
        res.send({"ok":true,"msg":"Registered Successfully"});
    }
})

// For checking if user there
userRoute.post("/login",async(req,res)=>{
    let check = await UserModel.find(req.body);
    let memberCheck = await MemberModel.find({email:req.body.email});

    if(check.length > 0){
        var token = jwt.sign({ userID: check[0]._id }, 'token');
        res.send({"ok":true,"msg":"Login Successfull","token":token,"userData":check[0]});
    } else if(memberCheck.length > 0){
        var token = jwt.sign({ memberID: memberCheck[0]._id }, 'token');
        res.send({"ok":true,"msg":"Login Successfull","token":token,"userData":memberCheck[0]});
    } else {
        res.send({"ok":false,"msg":"Wrong Credentials"});
    }
})



module.exports = {
    userRoute
}