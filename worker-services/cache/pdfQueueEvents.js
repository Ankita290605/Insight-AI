const {QueueEvents} = require("bullmq");
require("dotenv").config();

const pdfQueueEvents = new QueueEvents("pdf",{
    connection:{
        host:process.env.REDIS_HOST,
        port:Number(process.env.REDIS_PORT)
    }
});

pdfQueueEvents.on("active",({jobId})=>{
    console.log(`Job ${jobId} started`);
});

pdfQueueEvents.on("completed",({jobId})=>{
    console.log(`Job ${jobId} completed`);
});

pdfQueueEvents.on("failed",({jobId,failedReason})=>{
    console.log(`Job ${jobId} failed: ${failedReason}`);
});

pdfQueueEvents.on("progress",({jobId,data})=>{
    console.log(`Job ${jobId} progress:`,data);
});

module.exports - pdfQueueEvents;