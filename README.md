# IdeaForge

IdeaForge is a full-stack collaborative innovation platform where users can share ideas, discover emerging concepts, receive AI-powered feedback, remix existing ideas, and collaborate with other creators to transform ideas into meaningful projects.

The platform is designed to bridge the gap between inspiration and execution by providing tools for idea validation, community engagement, and collaborative development.

---

## Live Demo

Frontend: https://ideafor.netlify.app

Backend API: https://idea-forge-l7b1.onrender.com

API Documentation: https://idea-forge-l7b1.onrender.com/docs

---

## Key Features

### Authentication & Security

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* Session Management
* Secure Password Hashing
* Role-based Access Controls

### Idea Management

* Create and Publish Ideas
* Edit Existing Ideas
* Delete Ideas
* Public Idea Feed
* Detailed Idea Pages
* Trending Ideas
* Idea Status Tracking
* Bookmark Ideas

### Community & Social Features

* Like Ideas
* Comment on Ideas
* Follow Users
* Real-time Notification System
* Personalized Feeds
* User Discovery

### Remix System

* Remix Existing Ideas
* Parent-Child Idea Relationships
* Remix Lineage Tracking
* Interactive Remix Tree Visualization
* Idea Evolution Mapping

### Collaboration System

* Collaboration Requests
* Contributor Management
* Request Approval Workflow
* Public Collaborator Profiles
* Team Formation Around Ideas

### AI-Powered Features

* AI Idea Reviews
* Strength & Weakness Analysis
* Target Audience Identification
* MVP Recommendations
* Monetization Suggestions
* Groq-powered AI Integration

### User Profiles & Analytics

* Custom User Profiles
* Bio and Profile Information
* Profile Picture Support
* User Contributions
* Creator Analytics Dashboard
* Most Popular Idea Insights
* Follower and Engagement Metrics

### User Experience

* Neo-Brutalist Design System
* Responsive Interface
* Skeleton Loading States
* Meaningful Empty States
* Optimized API Performance
* Modern Content-Focused UI

---

## Technology Stack

### Frontend

* React
* Vite
* React Router DOM
* Axios
* JavaScript
* CSS

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic
* JWT Authentication
* Passlib

### AI

* Groq API
* LLM-powered Idea Analysis

### Database & Deployment

* PostgreSQL (Neon)
* Render
* Netlify

---

## Project Structure

```text
IdeaForge/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── database/
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   │
│   └── package.json
│
└── README.md
```

---

## Backend Setup

### Clone the Repository

```bash
git clone <repository-url>
cd IdeaForge
```

### Navigate to Backend

```bash
cd backend
```

### Create Virtual Environment

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=your_groq_api_key
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Database Design

Core entities include:

* Users
* Ideas
* Tags
* Comments
* Likes
* Bookmarks
* Notifications
* Follows
* Collaboration Requests
* AI Reviews

The database schema is designed around relational data modeling to support social interactions, idea evolution, collaboration workflows, and AI-assisted innovation.

---

## Current Functionality

* JWT Authentication
* User Registration & Login
* Public Feed
* Idea Creation & Editing
* Idea Status Tracking
* Trending Ideas
* Likes & Comments
* Bookmarks
* Follow System
* Notifications
* User Profiles
* Creator Analytics
* Remix System
* Remix Tree Visualization
* Collaboration Requests
* AI Idea Reviews
* Protected Routes
* Full Deployment Pipeline

---

## Roadmap

### AI Enhancements

* Idea Similarity Detection
* AI Remix Suggestions
* Semantic Idea Search
* AI-generated Idea Summaries

### Collaboration Enhancements

* Real-time Collaboration Updates
* Project Workspaces
* Team Communication Features
* Contributor Reputation System

### Platform Growth

* Innovation Graph Visualization
* Advanced Search & Discovery
* Mobile Experience Improvements
* Theme Customization
* Recommendation Engine

---

## Inspiration

Many promising ideas never progress beyond initial thoughts because they lack feedback, visibility, or the right collaborators.

IdeaForge was built to provide a platform where ideas can be shared, improved, validated, and developed collaboratively through community participation and AI-assisted guidance.

The goal is to help creators move from concept to execution by combining social collaboration, intelligent feedback, and idea evolution into a single platform.

---

## License

This project is licensed under the MIT License.

---

## Author

Sushanth

Software Engineering • AI • Full-Stack Development • Innovation Systems
