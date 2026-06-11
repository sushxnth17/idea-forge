# 🚀 IdeaForge

IdeaForge is a full-stack collaborative innovation platform where users can share ideas, discover community-driven solutions, and contribute to the growth of existing concepts.

The platform is designed to transform raw ideas into meaningful projects by enabling discussion, engagement, and collaboration among creators.

---

## 🌐 Live Demo

**Frontend:** https://ideafor.netlify.app

**Backend API:** https://idea-forge-l7b1.onrender.com

**API Documentation:** https://idea-forge-l7b1.onrender.com/docs

---

## ✨ Features

### 🔐 Authentication

- User Registration
- Secure Login with JWT Authentication
- Protected Routes
- Session Management
- Logout Functionality

### 💡 Idea Management

- Create Ideas
- Browse Public Feed
- View Detailed Idea Pages
- Trending Ideas Section
- Idea Discovery System

### ❤️ Community Features

- Like Ideas
- Comment on Ideas
- Bookmark Ideas
- Follow Users
- Notifications System

### 👤 User Profiles

- Personalized User Profiles
- Update Profile Information
- User Bio Support
- View User Contributions

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- JavaScript
- CSS

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- Passlib (Password Hashing)

### Database & Deployment

- PostgreSQL (Neon)
- Render (Backend Deployment)
- Netlify (Frontend Deployment)

---

## 🏗️ Project Structure

```text
IdeaForge/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   └── database/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
│
└── README.md
```

---

## ⚙️ Backend Setup

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Create Virtual Environment

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### Mac/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_connection_string
```

### 5. Run Backend Server

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger Docs:

```text
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔗 API Integration

IdeaForge uses Axios to communicate with the FastAPI backend.

Authentication is handled through JWT access tokens stored in the browser and attached to authenticated API requests.

---

## 🗄️ Database Design

The application uses PostgreSQL with SQLAlchemy ORM.

### Core Entities

- Users
- Ideas
- Comments
- Likes
- Bookmarks
- Notifications
- Follows

The schema is designed using relational database principles to support social interactions and idea collaboration.

---

## ✅ Current Functionality

- JWT Authentication
- User Registration & Login
- Public Idea Feed
- Trending Ideas
- Create Idea
- Idea Details Page
- Likes System
- Comments System
- Bookmarks
- Follow Users
- Notifications
- User Profiles
- Protected Routes
- Full Deployment Pipeline

---

## 🚀 Future Roadmap

### AI Features

- AI-Powered Idea Summaries
- Semantic Idea Search
- Idea Similarity Detection

### Collaboration Features

- Real-Time Notifications
- Idea Collaboration Rooms
- Team-Based Idea Development
- Idea Branching System

### Platform Improvements

- Contributor Reputation System
- Innovation Graph Visualization
- Dark / Light Theme
- Enhanced Mobile Experience

---


## 🧠 Inspiration

Many great ideas are lost because they are never shared, discussed, or improved collaboratively.

IdeaForge was built to provide a space where creators can publish ideas, receive feedback, discover opportunities, and work together to turn concepts into reality.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sushanth**

Building AI, software engineering, and innovation-focused projects.
