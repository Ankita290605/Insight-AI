const workspaceMemberService = require("../services/workspaceMemberService");

const addMember = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }
        if(!req.body || !req.body.workspaceId || !req.body.targetUserId || !req.body.role){
            throw new Error("Required fields missing");
        }
        const member = await workspaceMemberService.addMember({userId:req.user.id,...req.body});

        return res.status(201).json({
            success:true,
            message:"Member added successfully",
            payload:member
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}
const removeMember = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }
        if(!req.body || !req.body.workspaceId || !req.body.workspaceMemberId){
            throw new Error("Required fields missing");
        }
        const member = await workspaceMemberService.removeMember({userId:req.user.id,...req.body});

        return res.status(200).json({
            success:true,
            message:"Member removed successfully",
            payload:member
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}
const updateMember = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }
        if(!req.body || !req.body.targetUserId || !req.body.workspaceId || !req.body.newRole){
            throw new Error("Required fields missing");
        }
        const member = await workspaceMemberService.updateMember({userId:req.user.id,...req.body});

        return res.status(200).json({
            success:true,
            message:"Member updated successfully",
            payload:member
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {
    addMember,
    removeMember,
    updateMember
};