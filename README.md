# <h1 align="center">Arkha - AI-Powered Resume Analysis Platform</h1>

<div align="center">

[![License: MIT](https://img.shields.io/github/license/Totenem/Arkha?style=for-the-badge&color=purple)](https://github.com/Totenem/Arkha/blob/main/LICENSE)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![AI](https://img.shields.io/badge/AI-Groq-00A67E?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)
[![Contributors](https://img.shields.io/github/contributors/Totenem/Arkha?style=for-the-badge&color=blueviolet)](https://github.com/Totenem/Arkha/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/Totenem/Arkha?style=for-the-badge&color=blue)](https://github.com/Totenem/Arkha/commits/main)

</div>

<h2 align="center">🚀 Project Overview</h2>

> **Arkha** is a modern, full-stack web application that helps job seekers optimize their resumes and cover letters. Built with ❤️ using FastAPI, React, and Groq's AI capabilities, it provides real-time resume analysis, job matching, and improvement suggestions to help users land their dream jobs.

## ✨ Features

### Backend API
- 🔍 Smart information extraction from resumes and cover letters
- 🎯 Job description matching with percentage score
- 💡 AI-powered improvement suggestions
- 🧹 Efficient temporary file handling
- 🔒 Secure API key management
- ⚡ Fast and reliable processing

### Frontend Interface
- 🎨 Modern, responsive design
- 📱 Mobile-friendly interface
- 🔄 Real-time analysis feedback
- 📊 Visual match score representation
- 📝 Interactive improvement suggestions
- 🎯 Job description input interface
- 📤 Easy file upload system

## 🛠️ Tech Stack

| Frontend | Backend | AI/ML | UI/UX |
|----------|---------|-------|-------|
| ![React](https://img.shields.io/badge/React-61DAFB?logo=react) | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi) | ![Groq](https://img.shields.io/badge/Groq-00A67E?logo=openai) | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss) |
| React, TypeScript | Python | Groq API | Material-UI, React Icons |

## 📁 Project Structure

```text
arkha/
├── main.py              # FastAPI application and endpoints
├── utils.py            # Utility functions for PDF processing and API calls
├── requirements.txt    # Backend dependencies
├── .env               # Backend environment variables
├── frontend/          # React frontend application
│   ├── src/          # Source files
│   ├── public/       # Static files
│   ├── package.json  # Frontend dependencies
│   └── .env         # Frontend environment variables
├── LICENSE           # MIT License
└── README.md         # Project documentation
```

## ⚡ Setup Instructions

### 1. 🚥 Clone the repository
```bash
git clone https://github.com/yourusername/arkha.git
cd arkha
```

### 2. 🐍 Backend Setup (FastAPI)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
- Create a `.env` file with your Groq API key:
```env
GROQ_API_KEY=your_api_key_here
```
- Start the backend server:
```bash
uvicorn main:app --reload
```

### 3. ⚛️ Frontend Setup (React)
```bash
cd frontend
npm install
```
- Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
```
- Start the development server:
```bash
npm start
```

## 📚 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/get-assess` | Analyze resume against job description |
| GET    | `/health` | Check API health status |

## 💡 Tips

- 📄 Upload your resume in PDF format for best results
- 🎯 Be specific in your job description for better matching
- 💡 Review and implement the improvement suggestions
- 🔄 Keep your resume updated with new skills and experiences
- 🐞 If you encounter issues, check the console logs

## 🤝 Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/yourusername/arkha/pulls)

1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## 📞 Support
For questions or support, open an issue on GitHub or contact the maintainer.

## 📝 License

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](LICENSE) 