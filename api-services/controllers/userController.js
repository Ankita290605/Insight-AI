const userService = require("../services/userService");

const userRegister = async(req,res)=>{
    try{
        if(!req.body||!req.body.username || !req.body.password){
            throw new Error("Missing required fields");
        }

        const user = await userService.register(req.body.username,req.body.password);

        return res.status(201).json({
            success:true,
            message:"User was created successfully",
            payload:user
        });

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const userLogin = async(req,res)=>{
    try{
        if(!req.body||!req.body.username || !req.body.password){
            throw new Error("Missing required fields");
        }
        const token = await userService.login(req.body.username,req.body.password);

        return res.status(200).json({
            success:true,
            message:"User was logged in successfully",
            token:token
        });

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {
    userRegister,
    userLogin
};