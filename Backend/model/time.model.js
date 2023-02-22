const mongoose = require("mongoose");

const timeSchema = mongoose.Schema({
    mon:Array,
    tue:Array,
    wed:Array,
    thu:Array,
    fri:Array,
    userID:String,
    memebrID:String
},{
    versionKey:false
})

const TimeModel = mongoose.model("time",timeSchema);

module.exports = {
    TimeModel
}