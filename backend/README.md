# Arkha Backend API

> **Backend API** for the Arkha AI-Powered Resume & Cover Letter Optimization Platform. Built with FastAPI, Python, and Groq's AI capabilities.

## 🚀 Features

- 🔍 Smart information extraction from resumes and job descriptions
- 🎯 Job description matching with percentage score
- 💡 AI-powered improvement suggestions
- 📝 Automatic cover letter generation
- 🧹 Efficient temporary file handling
- 🔒 Secure API key management
- ⚡ Fast and reliable processing
- 🎯 Industry-specific resume analysis
- 🗄️ PostgreSQL database integration
- 🐳 Docker containerization support

## 🛠️ Tech Stack

| Backend | AI/ML | Database | Containerization |
|---------|-------|----------|------------------|
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi) | ![Groq](https://img.shields.io/badge/Groq-00A67E?logo=openai) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql) | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker) |
| FastAPI, Python, PyMuPDF | Groq LLaMA API | PostgreSQL, SQLAlchemy | Docker, Docker Compose |

## 📁 Backend Structure

```text
backend/
├── main.py              # FastAPI application and endpoints
├── utils.py            # Utility functions for PDF processing and API calls
├── requirements.txt    # Backend dependencies
├── docker-compose.yml  # Docker services configuration
├── db/
│   └── database.py     # Database connection and models
├── models/
│   └── user.py         # User data models
└── README.md          # This file
```

## ⚡ Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Docker and Docker Compose (optional, for containerized setup)
- Groq API key

### Method 1: Local Development Setup

#### 1. 🐍 Create Virtual Environment
```bash
cd backend
python -m venv venv
```

#### 2. 🔧 Activate Virtual Environment
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### 3. 📦 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. 🔑 Environment Configuration
Create a `.env` file in the backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://arkha_user:arkha_password@localhost:5432/arkha_db
```

#### 5. 🚀 Start the Development Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### Method 2: Docker Setup (Recommended)

#### 1. 🐳 Start Database Services
```bash
cd backend
docker-compose up -d postgres pgadmin
```

#### 2. 🔑 Environment Configuration
Create a `.env` file in the backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://arkha_user:arkha_password@localhost:5432/arkha_db
```

#### 3. 🚀 Start the Application
```bash
# With virtual environment activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET    | `/` | Health check endpoint | None |
| GET    | `/health` | Detailed health check | None |
| POST   | `/get-assess` | Analyze resume against job description | `job_description`, `sector`, `file` |

### Example API Usage

#### Health Check
```bash
curl http://localhost:8000/health
```

#### Resume Analysis
```bash
curl -X POST "http://localhost:8000/get-assess" \
  -H "Content-Type: multipart/form-data" \
  -F "job_description=Software Engineer position at tech company" \
  -F "sector=Technology" \
  -F "file=@resume.pdf"
```

## 🗄️ Database Setup

### PostgreSQL with Docker
The project includes a `docker-compose.yml` file for easy database setup:

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Access pgAdmin at http://localhost:5050
# Email: admin@arkha.com
# Password: admin123
```

### Database Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: arkha_db
- **Username**: arkha_user
- **Password**: arkha_password

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GROQ_API_KEY` | Groq API key for AI processing | Yes | - |
| `DATABASE_URL` | PostgreSQL connection string | No | postgresql://arkha_user:arkha_password@localhost:5432/arkha_db |

### API Configuration
- **Host**: 0.0.0.0 (allows external connections)
- **Port**: 8000
- **CORS**: Enabled for all origins (development only)

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Use secure environment variable management
2. **CORS**: Configure specific allowed origins instead of "*"
3. **Database**: Use managed PostgreSQL service
4. **API Keys**: Store securely using secrets management
5. **HTTPS**: Enable SSL/TLS encryption
6. **Rate Limiting**: Implement API rate limiting
7. **Monitoring**: Add logging and monitoring

### Docker Production Build
```bash
# Build production image
docker build -t arkha-backend .

# Run production container
docker run -p 8000:8000 --env-file .env arkha-backend
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Import Errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall dependencies
pip install -r requirements.txt
```

#### 2. Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database services
docker-compose restart postgres
```

#### 3. API Key Issues
- Verify your Groq API key is valid
- Check that the `.env` file is in the correct location
- Ensure no extra spaces or quotes in the API key

#### 4. Port Already in Use
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn main:app --reload --port 8001
```

## 📝 Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes in appropriate files
3. Test locally with `uvicorn main:app --reload`
4. Update this README if needed
5. Submit pull request

### Code Structure
- `main.py`: FastAPI app configuration and endpoints
- `utils.py`: Business logic and AI processing functions
- `db/database.py`: Database connection and configuration
- `models/`: Data models and schemas

## 📞 Support

For backend-specific issues:
1. Check the troubleshooting section above
2. Review the FastAPI documentation
3. Check Groq API documentation for AI-related issues
4. Open an issue on GitHub

## 📄 License

This backend is part of the Arkha project and is licensed under the MIT License.
