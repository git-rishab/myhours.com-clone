const jwt = require("jsonwebtoken");


const authorisation = (req,res,next)=>{
    let token = req.headers.authorization;

    jwt.verify(token, 'token', (err, decoded)=>{
        if(err){
            res.send(err);
        }
        if(decoded){
            req.body.userID = decoded.userID;
            next();
        } else {
            res.send({"msg":"please login first"});
        }
        
    });
}

module.exports = {
    authorisation
}