

const questionHelper = require("../helpers/questionHelper");
const rule = require("./rules");
const {SIMILARITY_THRESHOLD} = require("../config/rag");

const question = async ({ userId, workspaceId, question, conversationId, onChunk, onNoContext, onSources, onError }) => {
    try {

        const conversationExists = await rule.conversationExists(conversationId, userId, workspaceId);
        if (!conversationExists) {
            throw new Error("Conversation doesn't exist");
        }

        const chunks = await questionHelper.retrieveRelevantChunks(question, workspaceId);
        const bestMatch = chunks[0];
        

        if (!bestMatch || bestMatch.distance > SIMILARITY_THRESHOLD) {
            onNoContext();
            return;
        }
        const previousMessages = await questionHelper.getPreviousMessages(conversationId);
        await questionHelper.saveMessage(question, "USER", conversationId);

        const context = questionHelper.buildContext(chunks);
        const history = questionHelper.buildHistory(previousMessages);

        const contents = questionHelper.createContent(history, question);

        onSources(chunks);
        const stream = await questionHelper.createStream(context, contents);
        const answer = await questionHelper.streamAnswer(stream, onChunk);


        await questionHelper.saveMessage(answer, "ASSISTANT", conversationId);

    } catch (error) {
        onError(error.message);
    }

}

module.exports = { question };