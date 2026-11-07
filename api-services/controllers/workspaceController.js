const workspaceService = require("../services/workspaceService");

const addWorkspace = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }
        if(!req.body || !req.body.name){
            throw new Error("Missing required fields");
        }

        const workspace = await workspaceService.createWorkspace(req.user.id,req.body.name);

        return res.status(201).json({
            success:true,
            message:"Workspace created successfully",
            payload:workspace
        });

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}
const removeWorkspace = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }
        if(!req.body || !req.body.workspaceId){
            throw new Error("Missing required fields");
        }

        const workspace = await workspaceService.removeWorkspace(req.user.id,req.body.workspaceId);

        return res.status(200).json({
            success:true,
            message:"Workspace deleted successfully",
            payload:workspace
        });

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {
    addWorkspace,
    removeWorkspace
};