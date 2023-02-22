const express = require("express");
const {ClientModel} = require("../model/client.model");

const clientRoute = express.Router();

// Get all client by sending userID in payload
clientRoute.post("/",async(req,res)=>{
    let data = await ClientModel.find(req.body);
    res.send(data);
})

// Add new Client
clientRoute.post("/create",async(req,res)=>{
    let data = new ClientModel(req.body);
    await data.save();
    res.send({"ok":true,"msg":"client added successfully"});
})

module.exports = {
    clientRoute
}