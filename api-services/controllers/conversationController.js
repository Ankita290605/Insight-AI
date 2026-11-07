const conversationService = require("../services/conversationService");


const addConversation = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }
        if(!req.body || !req.body.workspaceId){
            throw new Error("Required fields are missing");
        }

        const conversation = await conversationService.addConversation({userId:req.user.id,...req.body});

        return res.status(201).json({
            success:true,
            message:"Conversation created successfully",
            payload:conversation
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {addConversation};