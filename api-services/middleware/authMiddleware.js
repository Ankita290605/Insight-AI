const authHelper = require("../helpers/authHelper");

const authMiddleware = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            throw new Error("Unauthorized");
        }
        const parts = authHeader.split(' ');
        if(parts.length!==2 || parts[0]!=="Bearer"){
            throw new Error("Wrong token format");
        }

        const token = parts[1];

        const decoded = authHelper.verifyToken(token);

        req.user=decoded;
        next();

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = authMiddleware;