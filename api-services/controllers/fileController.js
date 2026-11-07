const minioClient = require("../config/minio");
const typeHelper = require("../helpers/typeHelper");
const {fileTypeFromBuffer}=require("file-type");
const fileService = require("../services/fileService");
const crypto = require("crypto");
const uploadFile = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }
        const file = req.file;

         if(!file || !file.originalname || !file.mimetype || !file.size || !file.buffer){
       
            throw new Error("Couldn't upload file");
        }
        if(!req.body || !req.body.workspaceId ){

        }
        const detectedType = await fileTypeFromBuffer(file.buffer);

        const allowed = typeHelper.checkType(detectedType.mime);

        if(!allowed){
            throw new Error("Unsupported file format");
        }

        const objectName = `${req.user.id}/${crypto.randomUUID()}-${file.originalname}`;
       

        await minioClient.putObject("files",objectName,file.buffer,file.size,{
            "Content-Type":file.mimetype
        });

        const fileUploaded = await fileService.uploadFile(req.user.id,file,req.body.workspaceId,objectName);

        return res.status(201).json({
            success:true,
            message:"File was uploaded successfully",
            payload:fileUploaded
        });


    }catch(error){
 
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {
    uploadFile
};