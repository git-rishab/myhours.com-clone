const mongoose = require("mongoose");

const timeSchema = mongoose.Schema({
    data:Array,
    userID:String,
    email:String,
    memebrID:String
},{
    versionKey:false
})

const TimeModel = mongoose.model("time",timeSchema);

module.exports = {
    TimeModel
}