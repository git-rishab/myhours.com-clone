const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    address:String,
    userID:String
},{
    versionKey:false
})

const ClientModel = mongoose.model("client",clientSchema);

module.exports = {
    ClientModel
}