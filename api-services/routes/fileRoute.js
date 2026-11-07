const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const fileController = require("../controllers/fileController");
const router = express.Router();

router.post("/upload",authMiddleware,(req,res)=>{
    uploadMiddleware.single("file")(req,res,(error)=>{
        if(error){
            return res.status(400).json({
                success:false,
                message:error.message
            });
        }
        fileController.uploadFile(req,res);
    });
});

module.exports = router;