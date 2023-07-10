const jwt = require("jsonwebtoken");
const userdb = require("../models/UserSchema");
const keysecret = process.env.SECRET_KEY


const authenticate = async(req,res,next)=>{

    try {
        const token =  req.session.token;
        if (!token) {
            return res.status(400).json({status:401, msg: "No token provided!",});
        }
        const verifytoken = jwt.verify(token,keysecret);
        
        const rootUser = await userdb.findOne({_id:verifytoken._id});
        
        if(!rootUser) {return res.status(400).json({msg:"user not found"})}

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id
        console.log("inmiddles ware")
        next();
    } catch (error) {
        return res.status(401).json({status:401,msg:"Unauthorized"})
    }
}


module.exports = authenticate