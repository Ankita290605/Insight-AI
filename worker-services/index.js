const startWorker = async()=>{
  
    require("./cache/pdfQueueEvents");
    require("./cache/PdfQueue");
    console.log("Worker started successfully");
}

startWorker();