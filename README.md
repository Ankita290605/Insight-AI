# Insight AI

A Retrieval-Augmented Generation (RAG) application built with Node.js, PostgreSQL (pgvector), Gemini, BullMQ and Redis.

The application allows users to upload PDF documents, indexes them using vector embeddings, and answers questions using semantic search over the uploaded documents instead of relying on the model's general knowledge.

## Features

- PDF document upload
- Background PDF processing with BullMQ
- Automatic text extraction
- Intelligent text chunking
- Gemini Embeddings (`gemini-embedding-001`)
- Vector search using PostgreSQL + pgvector
- Similarity threshold to reduce hallucinations
- Conversation memory
- Streaming AI responses (Server-Sent Events)
- Source chunk retrieval
- Workspace-based document isolation

---

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- pgvector

### AI

- Google Gemini 2.5 Flash
- Gemini Embedding API

### Background Processing

- BullMQ
- Redis

### Storage

- MinIO

---

## How It Works

### 1. Document Upload

A PDF is uploaded and stored inside MinIO.

---

### 2. Background Processing

BullMQ processes the uploaded document asynchronously.

The worker:

- downloads the PDF
- extracts text
- splits the document into chunks
- generates embeddings for every chunk
- stores the chunks together with their vector embeddings inside PostgreSQL

---

### 3. User Question

When a user asks a question:

1. The question is converted into an embedding.
2. PostgreSQL performs vector similarity search.
3. The five most relevant chunks are retrieved.
4. A similarity threshold is applied.
5. Previous conversation history is loaded.
6. Gemini generates an answer using only the retrieved context.
7. The response is streamed back to the client using Server-Sent Events.

---

## Project Structure

```
api-services/
│
├── controllers/
├── services/
├── helpers/
├── routes/
├── config/
└── prisma/

worker-services/
│
├── services/
├── cache/
├── helpers/
└── config/
```

---

## RAG Pipeline

```
PDF Upload
      │
      ▼
MinIO Storage
      │
      ▼
BullMQ Worker
      │
      ▼
Extract Text
      │
      ▼
Chunk Document
      │
      ▼
Generate Embeddings
      │
      ▼
Store in PostgreSQL (pgvector)

──────────────────────────────────────

User Question
      │
      ▼
Generate Question Embedding
      │
      ▼
Vector Search
      │
      ▼
Retrieve Top 5 Chunks
      │
      ▼
Load Conversation History
      │
      ▼
Gemini 2.5 Flash
      │
      ▼
Streaming Response (SSE)
```

---

## Similarity Search

The application uses pgvector's cosine distance operator to retrieve the most relevant document chunks.

A configurable similarity threshold prevents the model from answering questions unrelated to the uploaded documents.

---

## Conversation Memory

Conversation history is stored in the database.

The latest messages are included in every request, allowing the assistant to answer follow-up questions while still relying on retrieved document context.

---

## Streaming Responses

Responses are streamed token-by-token using Server-Sent Events (SSE), allowing clients to display answers in real time instead of waiting for the entire response.

---

## Future Improvements

- Hybrid Search (Vector + Keyword)
- Embedding Cache
- Support for additional file formats (DOCX, TXT, Markdown)
- Automatic conversation summarization
- Metadata filtering
- Multi-document ranking
- Agent workflows

---

## Learning Goals

This project was built to understand the core concepts behind modern Retrieval-Augmented Generation systems rather than relying on existing frameworks.

Implemented concepts include:

- Semantic Search
- Vector Databases
- Embeddings
- Prompt Engineering
- Conversation Memory
- Streaming Responses
- Background Job Processing
- Similarity Thresholding
- Service Layer Architecture
