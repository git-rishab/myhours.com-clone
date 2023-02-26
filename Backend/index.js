const express = require("express");
const cors = require("cors");
const {connection} = require("./db");
const {userRoute} = require("./routes/user.routes");
const {clientRoute} = require("./routes/client.routes");
const {projectRoute} = require("./routes/project.routes");
const {memberRoute} = require("./routes/member.routes");
const {timeRoute} = require("./routes/time.routes");
const {totalRoute} = require("./routes/total.routes");

require("dotenv").config();
const {authorisation} = require("./middlewares/jwt.middleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/",(req,res)=>{
    res.send("Welcome to Homepage");
})

app.use("/user",userRoute);

app.use(authorisation);
app.use("/client",clientRoute);

app.use("/project",projectRoute);

app.use("/member",memberRoute);

app.use("/time",timeRoute);

app.use("/total",totalRoute);

app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
    console.log(`Server running at port ${process.env.port}`);
})