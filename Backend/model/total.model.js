const mongoose = require("mongoose");

const totalSchema = mongoose.Schema({
    data:Object,
    userID:String,
    email:String
},{
    versionKey:false
})

const TotalModel = mongoose.model("total",totalSchema);

module.exports = {
    TotalModel
}