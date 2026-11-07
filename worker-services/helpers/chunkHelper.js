const pdf = require("pdf-parse");

const extractTextFromBuffer = async(stream)=>{
     const chunks =[];

    for await(const chunk of stream){
        chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const result = await pdf(buffer);

    return result.text;
}

const createChunks = (paragraphs) => {
    const MAX_CHARS = 1000;

    const chunks = [];
    let current = "";

    for (const paragraph of paragraphs) {
        if (current.length === 0) {
            current = paragraph;
            continue;
        }

        if (current.length + paragraph.length > MAX_CHARS) {
            chunks.push(current.trim());
            current = paragraph;
        } else {
            current += "\n\n" + paragraph;
        }
    }

    if (current.length > 0) {
        chunks.push(current.trim());
    }

    return chunks;
};

module.exports = {
    extractTextFromBuffer,
    createChunks
};