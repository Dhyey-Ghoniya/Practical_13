# Practical 13: AI API Integration into a Web Application

**Student Name:** Ghoniya Dhyey  
**Student ID:** 24CS024  
**Subject:** ITUE301 - AWDF (Advanced Web Development Frameworks)  
**Academic Year:** 2025-26  
**Institution:** Charotar University of Science and Technology (CHARUSAT), CSPIT  

---

## 🎯 Aim
To integrate an external AI service into the existing application, implementing secure server-side API key handling, graceful degradation failure paths, editable user suggestions, and responsible AI governance.

## 🛠️ Architecture & Security Model
```
React Frontend (Port 5174)
        │
        ▼ 'Propose with AI' Click
Express Backend /api/ai/generate-description (Port 5005)
        │
        ├── API Key stored ONLY in backend .env (NEVER exposed to client)
        ├── Rate limiter prevents rapid quota exhaustion
        ▼
External LLM Service (OpenAI / Gemini API)
        │
        ├── Success: Parse completion ──► Return editable description + priority
        └── Failure: Catch error ──► Return Graceful Heuristic Fallback (App never crashes)
```

## 📂 Project Structure
```
Practical_13/
├── backend/
│   ├── src/
│   │   ├── controllers/aiController.js # LLM invocation & graceful degradation
│   │   └── routes/aiRoutes.js
│   ├── server.js                      # Express API on port 5005
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Reactive form with AI generate button
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
└── README.md
```

## 🚀 Getting Started
```bash
# 1. Start Backend:
cd backend
npm install
npm start

# 2. Start Frontend:
cd ../frontend
npm install
npm run dev
```
