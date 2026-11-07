const Minio = require("minio");

require("dotenv").config();

const minioClient = new Minio.Client({
    endPoint:"localhost",
    port:9000,
    useSSL:false,
    accessKey:process.env.MINIO_USERNAME,
    secretKey:process.env.MINIO_PASSWORD
});

module.exports = minioClient;