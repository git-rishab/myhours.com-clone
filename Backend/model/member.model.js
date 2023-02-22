const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
    name:String,
    email:String,
    role:String,
    labourRate:Number,
    billableRate:Number,
    userID:String
},{
    versionKey:false
})

const MemberModel = mongoose.model("member",memberSchema);

module.exports = {
    MemberModel
}