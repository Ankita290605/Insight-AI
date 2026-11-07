const prisma = require("../config/prisma");
const minioClient = require("../config/minio");
const chunkHelper = require("../helpers/chunkHelper");
const ai = require("../config/gemini");
const processPdf = async(pdfId)=>{
  
    const document = await prisma.document.findUnique({
        where:{
            id:Number(pdfId)
        }
    });

    if(!document){
        throw new Error("Document doesn't exist");
    }

  
    const stream = await minioClient.getObject("files",document.path);

    

    const text =await chunkHelper.extractTextFromBuffer(stream);



    const paragraphs = text.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
    
    const chunks = chunkHelper.createChunks(paragraphs);
    

    await prisma.documentChunk.deleteMany({
        where:{
            document_id:document.id
        }
    });
  
    
   for(const[index,chunk] of chunks.entries()){
       const response = await ai.models.embedContent({
            model:"gemini-embedding-001",
            contents:chunk
        });

        
   const embedding = response.embeddings[0].values;
   const vector = `[${embedding.join(",")}]`;

   await prisma.$executeRaw`
    INSERT INTO "DocumentChunk"(document_id,chunk_index,content,embedding)
    VALUES(
    ${document.id},
    ${index},
    ${chunk},
    ${vector}::vector
    )
   `;
   }

  


}

module.exports = {processPdf};