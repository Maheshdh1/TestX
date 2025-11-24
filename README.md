<<<<<<< HEAD
# TestX
=======
# Question Paper Generator – Fullstack App

Stack:
- Frontend: Next.js (Pages Router) + Tailwind CSS + Axios + docx + file-saver
- Backend: Node.js + Express + MongoDB + Multer + Mammoth
- Features:
  - Upload multiple DOCX question banks
  - Parse and merge questions with topic detection
  - Store questions in MongoDB
  - Topic-based filtering
  - Generate Question Paper DOCX
  - Generate Answer Key DOCX
  - Basic admin UI to view/delete questions

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env   # edit MONGO_URI and PORT if needed
npm install
npm run dev
```

By default it runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

By default it runs on `http://localhost:3000`.

Make sure the backend is running and accessible from the frontend.
>>>>>>> 9258ce84 (Initial full project commit)
