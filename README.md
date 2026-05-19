# IdeaForge

IdeaForge is a collaborative platform where people can share ideas and others can improve, expand, and evolve them into better solutions, projects, or startup concepts.

The goal is to turn simple thoughts into powerful innovations through community collaboration.

---

# Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- TypeScript

## Backend
- FastAPI
- PostgreSQL
- SQLAlchemy

---

# Project Structure

```bash
idea-forge/
│
├── frontend/
├── backend/
└── README.md
```

---

# Features

- User Authentication
- Create Ideas
- Explore Ideas
- Add Contributions
- Upvote System
- User Profiles

---

# Backend Setup

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

## Windows
```bash
venv\Scripts\activate
```

## Mac/Linux
```bash
source venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn app.main:app --reload
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Future Plans

- AI-powered idea summaries
- Idea branching system
- Innovation graph visualization
- Contributor reputation system
- Semantic search

---

# License

MIT License