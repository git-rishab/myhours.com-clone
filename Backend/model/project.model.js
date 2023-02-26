const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name:String,
    description:String,
    billMethod:String,
    team:Array,
    tasks:Array,
    created:String,
    userID:String,
    billAmt:String,
    costAmt:String,
    totalHour:String
},{
    versionKey:false
})

const ProjectModel = mongoose.model("project",projectSchema);

module.exports = {
    ProjectModel
}