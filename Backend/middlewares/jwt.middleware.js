const jwt = require("jsonwebtoken");


const authorisation = (req,res,next)=>{
    let token = req.headers.authorization;

    jwt.verify(token, 'token', (err, decoded)=>{
        if(err){
            res.send({"msg":"Please Login First"});
        }
        if(decoded){
            req.body.userID = decoded.userID;
            next();
        } else {
            res.send({"msg":"Please Login First"});
        }
        
    });
}

module.exports = {
    authorisation
}