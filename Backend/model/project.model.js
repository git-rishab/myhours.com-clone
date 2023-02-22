const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name:String,
    client:String,
    description:String,
    billMethod:String,
    clientID:String,
    userID:String
},{
    versionKey:false
})

const ProjectModel = mongoose.model("project",projectSchema);

module.exports = {
    ProjectModel
}