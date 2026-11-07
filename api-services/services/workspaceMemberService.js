const prisma = require("../config/prisma");
const roleHelper = require("../helpers/roleHelper");
const rules = require("./rules");


const addMember = async({userId,workspaceId,targetedUserId,role})=>{
    const currentUserMember = await rules.checkIfUserIsPartOfTheWorkspace(userId);
    if(!currentUserMember){
        throw new Error("Current user is not part of the targeted workspace");
    }
    const targetedUserMember = await rules.checkIfUserIsPartOfTheWorkspace(targetedUserId);
    if(targetedUserMember){
        throw new Error("Target user is already part of the workspace");
    }
    const ownerOrAdmin = roleHelper.checkAdminOrOwner(currentUserMember.role);
    if(!ownerOrAdmin){
        throw new Error("Current user doesn't have permission to add new users");
    }
    
    const canAddRole = roleHelper.higherAuthority(currentUserMember.role,role);

    if(!canAddRole){
        throw new Error("User cannot add roles higher than their own");
    }

    const member = await prisma.workspaceMember.create({
        data:{
            workspace_id:Number(workspaceId),
            user_id:Number(userId),
            role:role
        }
    });
    return member;
}
const removeMember = async({userId,workspaceId,workspaceMemberId})=>{
    const currentUserIsMember = await rules.checkIfUserIsPartOfTheWorkspace(userId);
    if(!currentUserIsMember){
        throw new Error("Current user is not part of the targeted workspace");
    }
    const targetUserIsMember = await rules.checkIfUserIsPartOfTheWorkspace(workspaceMemberId);
    if(!targetUserIsMember){
        throw new Error("Target user is not part of the workspace");
    }
    const allowedToRemove = roleHelper.higherAuthority(currentUserIsMember.role,targetUserIsMember.role);

    if(!allowedToRemove){
        throw new Error("Current user doesn't have permission to remove target user");
    }

    const member = await prisma.workspaceMember.delete({
        where:{
            id:targetUserIsMember.id
        }
    });

    return member;


}
const updateMember = async({userId,targetUserId,workspaceId,newRole})=>{
     const currentUserIsMember = await rules.checkIfUserIsPartOfTheWorkspace(userId);
    if(!currentUserIsMember){
        throw new Error("Current user is not part of the targeted workspace");
    }
    const targetUserIsMember = await rules.checkIfUserIsPartOfTheWorkspace(workspaceMemberId);
    if(!targetUserIsMember){
        throw new Error("Target user is not part of the workspace");
    }
    const allowedToUpdate = roleHelper.checkIfCurrentUserCanModify(currentUserIsMember.role,targetUserIsMember.role,newRole);

    if(!allowedToUpdate){
        throw new Error("Current user can't modify target user");
    }

    const member = await prisma.workspaceMember.update({
        where:{
            id:targetUserIsMember.id
        },
        data:{
            role:newRole
        }
    });

    return member;
}



module.exports = {
    addMember,
    removeMember,
    updateMember
};