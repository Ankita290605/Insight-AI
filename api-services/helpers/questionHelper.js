const ai = require("../config/gemini");
const prisma = require("../config/prisma");

const retrieveRelevantChunks = async (question, workspaceId) => {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: question
    });
    const questionEmbedding = response.embeddings[0].values;

    const vector = `[${questionEmbedding.join(",")}]`;

    const chunks = await prisma.$queryRaw`
        Select dc.content,dc.chunk_index,dc.id,dc.document_id,dc.embedding <=> ${vector}::vector AS distance
        FROM "DocumentChunk" dc
        JOIN "Document" d
        ON d.id = dc.document_id
        WHERE d.workspace_id = ${Number(workspaceId)}
        ORDER BY dc.embedding <=> ${vector}::vector
        LIMIT 5
    `;

    return chunks;
}

const buildContext = (chunks) => chunks.map(chunk => chunk.content).join("\n\n");

const buildHistory = (messages) => {
    if (messages.length === 0) {
        return "No previous conversations";
    }

    return messages.reverse().map(message => ({
        role: message.role === "USER" ? "user" : "model",
        parts: [
            {
                text: message.content
            }
        ]

    }))
}

  const createStream =async(context,contents)=> {
    
    return ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        systemInstruction: `
       You are a document question-answering assistant.

You MUST answer ONLY using the retrieved document context below.

If the answer is not explicitly contained in the retrieved document context, respond exactly with:

"I couldn't find that information in the uploaded documents."

Never answer using your own knowledge.
Never guess.
Never infer information that is not present in the retrieved document context.

${context}
        `,
        contents
    });
}

    const streamAnswer = async(stream,onChunk)=>{
        let fullAnswer = "";


    for await (const chunk of stream) {
        const text = chunk.text;
      
        fullAnswer += text;
          onChunk(text);
    }
    return fullAnswer;
    }

    const createMessageRecord = async()=>{

    }

    const saveMessage = async(fullAnswer,role,conversationId)=>{

       return await prisma.message.create({
        data: {
            content: fullAnswer,
            role: role,
            conversation_id: Number(conversationId)
        }
    });
}

const createContent = (history,question)=>{
    return [

        ...history,
        {
            role: "user",
            parts: [
                {
                    text: question
                }
            ]
        }
    ];
}

const getPreviousMessages = async(conversationId)=>{
    return await prisma.message.findMany({
        where: {
            conversation_id: Number(conversationId)
        },
        orderBy: {
            created_at: "desc"
        },
        take: 10

    });
}

const getThreshold = ()=>{
    return 0.45;
}
module.exports = {
    buildContext,
    buildHistory,
    retrieveRelevantChunks,
    createStream,
    streamAnswer,
    saveMessage,
    createContent,
    getPreviousMessages,
    getThreshold
};