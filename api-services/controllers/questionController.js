const questionService = require("../services/questionService");

const askQuestion = async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("Unathorized");
        }

        if(!req.body || !req.body.workspaceId || !req.body.question || !req.params || !req.params.id){
            throw new Error("Required fields missing");
        }
        const conversationId = req.params.id;

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

       await questionService.question({userId:req.user.id,...req.body,conversationId:conversationId,
        onSources(chunks){
            res.write(`event: sources\n`);
            res.write(`data: ${JSON.stringify(chunks)}\n\n`);
        },
        onNoContext(){
            res.write(`event: no-context\n`);
            res.write(`data: i couldn't find information about this\n\n`);
            res.end();
        },
        onChunk(text){
            res.write(`event: chunk\n`);
            res.write(`data: ${text}\n\n`);
        },
        onError(error){
            res.write(`event: error\n`);
            res.write(`data: ${error}\n\n`);
            res.end();
        }

       });
       res.end();

      

    }catch(error){
        if(res.headersSent){
            res.end()
            return;
        }
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {askQuestion};