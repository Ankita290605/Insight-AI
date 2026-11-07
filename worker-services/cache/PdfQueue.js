const {Worker} = require("bullmq");
const processPdf = require("../services/processPdf");
require("dotenv").config();

const pdfWorker = new Worker("pdf",async(job)=>{
    await job.updateProgress(10);
    await processPdf.processPdf(job.data.pdfId);
    await job.updateProgress(100);
},
{
    connection:{
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT
    }
}
);


module.exports = pdfWorker;

