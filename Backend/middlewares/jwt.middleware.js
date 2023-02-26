const jwt = require("jsonwebtoken");


const authorisation = (req,res,next)=>{
    let token = req.headers.authorization;

    jwt.verify(token, 'token', (err, decoded)=>{
        if(err){
            res.send({"msg":"Please Login First"});
        }
        if(decoded){
            if(decoded.userID){
                req.body.userID = decoded.userID;
            } else {
                req.body.memebrID = decoded.memebrID;
            }
            next();
        } else {
            res.send({"msg":"Please Login First"});
        }
        
    });
}

module.exports = {
    authorisation
}