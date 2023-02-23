const express = require("express");
const {UserModel} = require("../model/user.model");
const {TimeModel} = require("../model/time.model");
const jwt = require("jsonwebtoken");


const userRoute = express.Router();


// For resgister
userRoute.post("/register",async(req,res)=>{
    let exist = await UserModel.find({email:req.body.email});

    if(exist.length > 0){
        res.send({"ok":false,"msg":"User Already Exist"});
    } else {
        let data = new UserModel(req.body);

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
    if(check.length > 0){
        var token = jwt.sign({ userID: check[0]._id }, 'token');
        res.send({"ok":true,"msg":"Login Successfull","token":token,"userData":check[0]});
    } else {
        res.send({"ok":false,"msg":"Wrong Credentials"});
    }
})



module.exports = {
    userRoute
}