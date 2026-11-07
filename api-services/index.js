const {startApp} = require("./app");
const minioClient = require("./config/minio");
const startServer = async()=>{
    const app = startApp();
    const bucketExists = await minioClient.bucketExists("files");
    if(!bucketExists){
        await minioClient.makeBucket("files");
    }

    app.listen(3000,()=>{
        console.log("Server is running");
    });
}

startServer();