const prisma = require("../config/prisma");

const checkIfUserIsPartOfTheWorkspace = async(userId,workspaceId)=>{
   
    const member = await prisma.workspaceMember.findFirst({
        where:{
            user_id:Number(userId),
            workspace_id:Number(workspaceId)
        }
    });
    if(!member){
        return false;
    }
    return true;
}
const userExists = async(userId)=>{
    const user = await prisma.user.findUnique({
        where:{
            id:Number(userId)
        }
    });

    if(!user){
        return false
    }
    return true;
}
const conversationExists = async(conversationId,userId,workspaceId)=>{
    const conversation = await prisma.conversation.findFirst({
        where:{
            id:Number(conversationId),
            user_id:Number(userId),
            workspace_id:Number(workspaceId)
        }
    });
    if(!conversation){
        return false;
    }
    return true;
}

module.exports = {
    checkIfUserIsPartOfTheWorkspace,
    userExists,
    conversationExists
};