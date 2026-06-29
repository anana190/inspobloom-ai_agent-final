# 🌸 IdeaBloom

**IdeaBloom** is an AI-powered web application designed to help users overcome creative blocks by analyzing their writing challenges and providing personalized recommendations, inspiration, and writing prompts.

The project was developed as an MVP (Minimum Viable Product) using modern web technologies and Generative AI.

---

# 📌 Project Overview

Creative block is a common problem among writers, students, content creators, and anyone working on creative tasks.

IdeaBloom helps users by:

- analyzing their creative block using AI
- identifying the type of block
- detecting the user's mood
- recommending books, movies and music
- generating personalized writing prompts
- tracking previous sessions through a personal dashboard
- allowing users to register and log in

The application provides a simple but effective AI-assisted creative coaching experience.

---

# 🚀 Live Demo

Live Website:

https://YOUR-RENDER-LINK.onrender.com

---

# ✨ Features

## User Authentication

- User Registration
- User Login
- Logout
- Local user session management

---

## Creative Block Analysis

Users can describe their creative problem in natural language.

The AI analyzes:

- Creative Block Type
- Emotional State
- Personalized Diagnosis

---

## AI Recommendations

Based on the analysis, the application recommends:

- 📚 Books
- 🎬 Movies
- 🎵 Music

that match the user's current creative situation.

---

## Personalized Writing Prompt

The system generates a unique writing prompt designed specifically for the user's creative block.

---

## Feedback System

Users can provide feedback by marking whether the generated prompt was helpful.

The application stores this feedback inside the dashboard history.

---

## Dashboard

Every user has a personal dashboard displaying:

- Number of AI sessions
- Helpful prompt count
- Creative progress history

---

# 🤖 AI Workflow

The project integrates Google's Gemini API.

Workflow:

User Input

↓

AI analyzes the text

↓

Block type detection

↓

Mood detection

↓

Recommendation generation

↓

Personalized writing prompt

↓

Feedback collection

↓

Dashboard history update

---

# 🛠 Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### AI

- Google Gemini API
- @google/generative-ai

### Other

- dotenv
- CORS

---

# 📂 Project Structure

```
IdeaBloom/

│

├── public/

│ ├── index.html

│ ├── style.css

│ └── script.js

│

├── server.js

├── package.json

├── README.md

├── .env.example

└── .gitignore
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/IdeaBloom.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run the application

```bash
node server.js
```

Open:

```
http://localhost:3000
```

---

# 📷 Screenshots

You can include screenshots of:

- Login Page
- Dashboard
- Creative Analysis
- AI Recommendations
- Writing Prompt

---

# 🎯 MVP Goals

The goal of this project was to create a functional AI-powered MVP capable of solving a real user problem.

The application demonstrates:

- authentication
- AI integration
- responsive user interface
- personalized recommendations
- live deployment
- GitHub version control

---

# 🔮 Future Improvements

Possible future enhancements include:

- Database integration (MongoDB / Firebase)
- Password hashing and authentication using JWT
- AI memory across sessions
- Progress analytics
- Daily writing challenges
- Creative streak tracking
- Email reminders
- Multiple creative modes (writing, design, music, art)
- AI Creative Coach Agent with long-term memory

---

# 👨‍💻 Author

Ana Ustiashvili

Business and Technology University (BTU)

Information Technologies

---

# 📄 License

This project was created for educational purposes.
