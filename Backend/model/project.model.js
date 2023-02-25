const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name:String,
    description:String,
    billMethod:String,
    managerID:String,
    normalID:String,
    created:String,
    userID:String
},{
    versionKey:false
})

const ProjectModel = mongoose.model("project",projectSchema);

module.exports = {
    ProjectModel
}