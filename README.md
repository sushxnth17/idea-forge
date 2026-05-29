### 🚀 IdeaForge

IdeaForge is a collaborative innovation platform where users can share ideas, improve existing concepts, and work together to transform simple thoughts into impactful solutions, projects, or startup opportunities.

The platform encourages community-driven creativity by allowing people to build upon each other's ideas through discussions, contributions, likes, remixes, and collaboration.

---

### ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login with JWT Authentication
- Protected Routes
- Logout Functionality

## 💡 Ideas

- Create New Ideas
- Public Idea Feed
- Detailed Idea Pages
- Idea Remixing System
- Trending Ideas

## ❤️ Social Interactions

- Like Ideas
- Comment on Ideas
- Bookmark Ideas
- Notifications System
- Follow Users

## 👤 User Features

- User Profiles
- Profile Updates
- Bio & Profile Picture Support

---

## 🛠️ Tech Stack

Frontend

- React
- Vite
- React Router DOM
- Axios
- JavaScript

Backend

- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT Authentication

---

## 📁 Project Structure

ideaForge/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── main.py
│
└── README.md

---

⚙️ Backend Setup

1️⃣ Move to Backend Folder

cd backend

2️⃣ Create Virtual Environment

Windows

python -m venv venv
venv\Scripts\activate

Mac/Linux

python3 -m venv venv
source venv/bin/activate

---

3️⃣ Install Dependencies

pip install -r requirements.txt

---

4️⃣ Run Backend Server

uvicorn app.main:app --reload

Backend will run at:

http://127.0.0.1:8000

Swagger Documentation:

http://127.0.0.1:8000/docs

---

💻 Frontend Setup

1️⃣ Move to Frontend Folder

cd frontend

---

2️⃣ Install Dependencies

npm install

---

3️⃣ Start Frontend

npm run dev

Frontend will run at:

http://localhost:5173

---

### 🔗 API Integration

Frontend communicates with FastAPI backend using Axios.

Authentication is handled using JWT tokens stored in local storage.

---

### 🗄️ Database

- PostgreSQL
- SQLAlchemy ORM
- Relationship-based schema design

Main tables:

- Users
- Ideas
- Comments
- Likes
- Tags
- Bookmarks
- Notifications
- Follows

---

### 📸 Current Functionalities

✅ Authentication System
✅ Public Feed
✅ Trending Ideas
✅ Idea Details Page
✅ Likes System
✅ Comments System
✅ Notifications
✅ Create Idea
✅ User Profiles
✅ Protected Routes

---

### 🚀 Future Enhancements

- AI-Powered Idea Summaries
- Semantic Idea Search
- Contributor Reputation System
- Innovation Graph Visualization
- Real-time Notifications
- Chat System
- Dark/Light Theme Toggle
- Mobile Responsive UI
- Idea Collaboration Rooms

---

### 🧠 Inspiration

IdeaForge was built to encourage collaborative innovation and help people turn raw ideas into meaningful creations through community participation.

---

### 📜 License

This project is developed for learning, innovation, and collaborative development purposes.
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
