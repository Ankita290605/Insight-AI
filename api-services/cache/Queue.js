const {Queue} = require("bullmq");

const pdfQueue = new Queue("pdf",{
    connection:{
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT
    }
});

module.exports = pdfQueue;