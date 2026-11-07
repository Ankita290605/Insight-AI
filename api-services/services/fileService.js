const prisma = require("../config/prisma");
const {checkIfUserIsPartOfTheWorkspace}=require("./rules");

const pdfQueue = require("../cache/Queue");
const uploadFile = async(userId,file,workspaceId,objectName)=>{
    
    
    const member=await checkIfUserIsPartOfTheWorkspace(userId,workspaceId);
    if(!member){
        throw new Error("User isn't part of the targeted workspace");
    }

    const fileUpload = await prisma.document.create({
        data:{
            file_name:objectName,
            file_size:file.size,
            mimetype:file.mimetype,
            path:objectName,
            uploaded_by:Number(userId),
            workspace_id:Number(workspaceId)
        }
    });

    await pdfQueue.add("send-pdf",
        {
        pdfId:fileUpload.id
        },
        {
            attempts:5,
            removeOnComplete:true,
            removeOnFail:false,
        }
);

    return fileUpload;
    
}

module.exports = {uploadFile};