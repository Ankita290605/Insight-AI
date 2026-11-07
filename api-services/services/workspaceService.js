const prisma = require("../config/prisma");
const {userExists} = require("./rules");


const createWorkspace = async(userId,name)=>{
    const user = await userExists(userId);
    if(!user){
        throw new Error("No such user");
    }
    const workspaceExists = await prisma.workspace.findFirst({
        where:{
            name:name,
            created_by:Number(userId)
        }
    });
    if(workspaceExists){
        throw new Error("Workspace with that name already exists for the current user");
    }
    const result = await prisma.$transaction(async(tx)=>{
        const workspace = await tx.workspace.create({
            data:{
                name:name,
                created_by:Number(userId)   
            }
        });
        const workspaceMember = await tx.workspaceMember.create({
            data:{
                workspace_id:workspace.id,
                user_id:Number(userId),
                role:"OWNER"
            }
        });
        return {workspace,workspaceMember};
    });

  
    return result.workspace;
}

const removeWorkspace = async(userId,workspaceId)=>{
    const workspaceExists = await prisma.workspace.findFirst({
        where:{
            id:Number(workspaceId),
            created_by:Number(userId)
        }
    });
    if(!workspaceExists){
        throw new Error("User doesn't own targeted workspace");
    }

    const result = await prisma.$transaction(async(tx)=>{
        const workspaceMember = await tx.workspaceMember.deleteMany({
            where:{
                workspace_id:workspaceExists.id
            }
        });
        const workspace = await tx.workspace.delete({
            where:{
                id:workspaceExists.id
            }
        });

        return {workspace,workspaceMember};
    });

    return result.workspace;

}

module.exports = {createWorkspace,
    removeWorkspace
};