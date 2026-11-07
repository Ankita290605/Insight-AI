const prisma = require("../config/prisma");
const rule = require("./rules");

const addConversation = async({userId,workspaceId,title})=>{
    const member = await rule.checkIfUserIsPartOfTheWorkspace(userId,workspaceId);

    if(!member){
        throw new Error("User is not part of the targeted workspace");
    }
    const data = {
        user_id:Number(userId),
            workspace_id:Number(workspaceId)
    };
    if(title) data.title=title;
    const conversation = await prisma.conversation.create({
        data
    });

    return conversation;
}

module.exports = {addConversation};