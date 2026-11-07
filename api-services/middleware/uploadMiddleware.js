const multer = require("multer");

const typeHelper=require("../helpers/typeHelper");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter:(req,file,cb)=>{
        const allowed = typeHelper.checkType(file.mimetype);
        
        if(!allowed){
            cb(new Error("Unsupported file format"))
        }
        cb(null,true);
    },
    limits:{
        fileSize:5*1024*1024
    }
});

module.exports = upload;