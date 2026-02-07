# Pathfinder - AI-Powered Job Matching Platform

<div align="center">

![Pathfinder](https://img.shields.io/badge/Pathfinder-Job%20Matching%20Platform-blue)
![Python](https://img.shields.io/badge/Python-3.11-green)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-teal)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)

</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Purpose](#purpose)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About the Project

**Pathfinder** is a comprehensive full-stack job matching platform that connects students with companies through intelligent AI-powered resume analysis and skill-based job matching. The platform serves dual user types (students and companies) and provides a seamless experience for job searching, application management, and interview preparation.

The platform leverages cutting-edge AI technologies including **Google Gemini AI** and **OpenAI** to automatically parse PDF resumes, extract skills, and calculate ATS (Applicant Tracking System) compatibility scores. This enables intelligent matching between candidate profiles and job requirements, significantly improving the job search experience for students and helping companies find the right talent efficiently.

---

## 🎯 Purpose

Pathfinder was designed to solve several key challenges in the job market:

- **For Students:**
  - Simplify the job search process with AI-powered resume analysis
  - Get personalized job recommendations based on skills and experience
  - Access comprehensive interview preparation resources (500+ questions)
  - Track applications and receive real-time notifications
  - Build professional profiles with projects, experiences, and achievements

- **For Companies:**
  - Post job openings and reach qualified candidates
  - Receive applications with AI-analyzed resume compatibility scores
  - Schedule and manage interviews efficiently
  - Access analytics dashboards for application insights
  - Find candidates that match job requirements automatically

The platform bridges the gap between job seekers and employers by providing intelligent matching algorithms, comprehensive tools, and a user-friendly interface that streamlines the entire recruitment process.

---

## ✨ Features

### Student Features

- **AI-Powered Resume Analysis**
  - Upload PDF resumes and get automatic skill extraction
  - ATS compatibility scoring
  - Resume optimization suggestions

- **Intelligent Job Matching**
  - Skill-based job recommendations
  - Match percentage calculation
  - Filtered job listings based on preferences

- **Application Management**
  - Track application status in real-time
  - View application history
  - Receive notifications for status updates

- **Interview Preparation**
  - Access to 500+ coding questions
  - Company-specific interview questions
  - Domain-based interview questions
  - Practice coding challenges

- **Profile Management**
  - Create comprehensive student profiles
  - Add projects, experiences, and achievements
  - Update profile information
  - View analytics dashboard

<!-- - **Additional Features**
  - Blog system for sharing knowledge
  - Bookmark favorite jobs
  - Smart review system for job applications
  - Real-time notifications -->

### Company Features

- **Job Posting**
  - Create and manage job listings
  - Set job requirements and qualifications
  - Define application deadlines

- **Application Management**
  - View all applications for posted jobs
  - Filter applications by status
  - Access AI-analyzed candidate profiles
  - Review resume compatibility scores

- **Interview Scheduling**
  - Schedule interviews with candidates
  - Manage interview calendar
  - Send interview invitations

- **Analytics Dashboard**
  - View application statistics
  - Track job posting performance
  - Monitor candidate engagement

- **Profile Management**
  - Create and update company profiles
  - Add company details and information
  - Manage company branding

---

## 🛠️ Technology Stack

### Backend

- **Framework:** FastAPI (Python 3.11)
- **Database:** MySQL with SQLAlchemy ORM
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing
- **AI Integration:**
  - Google Gemini AI (for resume analysis)
  <!-- - OpenAI (for AI-powered features) -->
- **File Storage:** Cloudinary (for PDF resume storage)
- **Caching:** Redis
- **Email Service:** FastAPI-Mail
- **Rate Limiting:** SlowAPI
- **Other Libraries:**
  - PyPDF2 (PDF processing)
  - scikit-learn (machine learning algorithms)
  - pandas, numpy (data processing)

### Frontend

- **Framework:** React.js 19.1.0
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **UI Libraries:**
  - Material-UI (MUI)
  - Tailwind CSS
  - Styled Components
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Markdown:** React Markdown
- **Icons:** Lucide React
<!-- - **Authentication:** Firebase -->

### DevOps & Deployment

- **Backend Hosting:** Render
- **Frontend Hosting:** Firebase Hosting
- **Database:** MySQL (cloud or local)
- **Environment Management:** python-dotenv

---

## 📁 Project Structure

```
Pathfinder/
├── Backend/                    # FastAPI backend application
│   ├── Routes/                 # API route handlers
│   │   ├── Student/           # Student-specific routes
│   │   │   ├── authentication.py
│   │   │   ├── application.py
│   │   │   ├── jobs.py
│   │   │   ├── resume.py
│   │   │   ├── profile.py
│   │   │   └── ...
│   │   └── Company/           # Company-specific routes
│   │       ├── authentication.py
│   │       ├── application.py
│   │       ├── interview.py
│   │       └── ...
│   ├── Schema/                # Database models (SQLAlchemy)
│   │   ├── student.py
│   │   ├── company.py
│   │   ├── jobs.py
│   │   └── ...
│   ├── config/                # Configuration files
│   │   ├── db.py             # Database configuration
│   │   ├── data.py
│   │   └── question.py
│   ├── utils/                 # Utility functions
│   │   ├── ai_google.py      # Google Gemini AI integration
│   │   ├── ai.py             # OpenAI integration
│   │   ├── resumeparse.py    # Resume parsing logic
│   │   ├── fastmail.py       # Email service
│   │   └── rate_limiter.py   # Rate limiting
│   ├── app.py                # FastAPI application entry point
│   └── requirements.txt      # Python dependencies
│
├── Frontend/                  # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   │   ├── Student/      # Student pages
│   │   │   └── Company/      # Company pages
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx           # Main App component
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js        # Vite configuration
│
└── README.md                  # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** and **npm** - [Download Node.js](https://nodejs.org/)
- **MySQL 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Required Accounts & API Keys

You'll need to create accounts and obtain API keys for the following services:

- **Google Gemini AI** - [Get API Key](https://makersuite.google.com/app/apikey)
- **OpenAI** - [Get API Key](https://platform.openai.com/api-keys)
- **Cloudinary** - [Sign Up](https://cloudinary.com/users/register/free) (for file storage)
- **Firebase** - [Get Started](https://firebase.google.com/) (for frontend hosting and authentication)
- **Email Service** - SMTP credentials (Gmail, SendGrid, etc.)

---

## 🚀 Installation

Follow these steps to set up Pathfinder in your local environment:

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/Pathfinder.git
cd Pathfinder
```

### Step 2: Backend Setup

1. **Navigate to the Backend directory:**

   ```bash
   cd Backend
   ```

2. **Create a virtual environment:**

   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Step 3: Frontend Setup

1. **Navigate to the Frontend directory:**

   ```bash
   cd ../Frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

### Step 4: Database Setup

1. **Create a MySQL database:**

   ```sql
   CREATE DATABASE pathfinder;
   ```

2. **The database tables will be created automatically when you run the backend application** (using SQLAlchemy's `Base.metadata.create_all()`).

3. **(Optional) Load Interview Questions:**
   If you want to populate the interview questions database, you can run:
   ```bash
   cd Backend/config
   python question.py
   ```
   Note: Make sure your `.env` file is configured before running this script.

---

## ⚙️ Configuration

### Backend Configuration

1. **Create a `.env` file in the `Backend` directory:**

   ```bash
   cd Backend
   touch .env  # On Windows: type nul > .env
   ```

2. **Add the following environment variables to `.env`:**

   ```env
   # Database Configuration
   DATABASE_URL=mysql+pymysql://username:password@localhost:3306/pathfinder

   # JWT Secret Key (generate a strong random string)
   SECRET_KEY=your_secret_key_here

   # AI API Keys
   GEMINI_API_KEY=your_gemini_api_key
   API_KEY_MODEL=your_openai_api_key

   # Cloudinary Configuration (for file storage)
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret

   # Email Configuration (SMTP)
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_email_app_password
   MAIL_FROM=your_email@gmail.com
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587

   # Debug Mode (optional)
   DEBUG=false
   ```

   **Important Notes:**
   - Replace all placeholder values with your actual credentials
   - Never commit the `.env` file to version control
   - For Gmail, you'll need to generate an "App Password" for `MAIL_PASSWORD`
   - Generate a strong `SECRET_KEY` using: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

### Frontend Configuration

1. **Configure Firebase (if using Firebase for authentication):**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your Firebase configuration to `Frontend/firebase.js` or `Frontend/src/utils/firebase.js`

2. **Update API Base URL:**
   - Update the API base URL in your frontend configuration files to point to your backend server
   - Default: `https://pathfinder-maob.onrender.com` for local development

---

## 🏃 Running the Application

### Running the Backend

1. **Activate your virtual environment** (if not already activated):

   ```bash
   cd Backend
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

2. **Start the FastAPI server:**

   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend API will be available at: `https://pathfinder-maob.onrender.com`
   <!--
      - API Documentation (Swagger UI): `https://pathfinder-maob.onrender.com/docs`
      - Alternative API Docs (ReDoc): `https://pathfinder-maob.onrender.com/redoc`
      - Health Check: `https://pathfinder-maob.onrender.com/health` -->

### Running the Frontend

1. **Navigate to the Frontend directory:**

   ```bash
   cd Frontend
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

   The frontend application will be available at: `http://localhost:5173` (or the port shown in the terminal)

### Running Both Together

You can run both servers simultaneously in separate terminal windows/tabs:

**Terminal 1 (Backend):**

```bash
cd Backend
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**

```bash
cd Frontend
npm run dev
```

---

## 📚 API Documentation

Once the backend server is running, you can access the interactive API documentation:

<!-- - **Swagger UI:** `https://pathfinder-maob.onrender.com/docs`
- **ReDoc:** `https://pathfinder-maob.onrender.com/redoc` -->

The API includes **57+ endpoints** organized into the following categories:

- **Student Routes:**
  - Authentication (`/student/login`, `/student/signup`)
  - Profile Management (`/student/profile`, `/student/details`)
  - Job Search (`/jobs`, `/jobs/with-match`)
  - Applications (`/student/apply`, `/student/applications`)
  - Resume (`/resume/uploadresume`, `/resume/getresume`)
  - Notifications (`/notifications`)
  - Interview Prep (`/api/questions`)
  - And more...

- **Company Routes:**
  - Authentication (`/company/login`, `/company/signup`)
  - Job Management (`/company/job/create`, `/company/jobs`)
  - Applications (`/company/applications`)
  - Interview Scheduling (`/company/interview`)
  - Profile Management (`/company/profile`)
  - And more...

---

## 🤝 Contributing

We welcome contributions from the open-source community! Pathfinder is an open-source project, and we appreciate any help you can provide.

### How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button on the top right of this repository
   - This creates a copy of the repository in your GitHub account

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/yourusername/Pathfinder.git
   cd Pathfinder
   ```

3. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style and conventions
   - Add comments where necessary
   - Test your changes thoroughly

5. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

   - Write clear, descriptive commit messages
   - Reference any related issues in your commit message

6. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the pull request template
   - Describe your changes and why they're needed

### Contribution Guidelines

- **Code Style:**
  - Follow PEP 8 for Python code
  - Use ESLint/Prettier for JavaScript/React code
  - Write meaningful variable and function names
  - Add docstrings to functions and classes

- **Testing:**
  - Test your changes before submitting
  - Ensure existing tests still pass
  - Add tests for new features when possible

- **Documentation:**
  - Update README.md if you add new features
  - Add comments to complex code sections
  - Update API documentation if you modify endpoints

- **Issues:**
  - Check existing issues before creating new ones
  - Use clear, descriptive issue titles
  - Provide steps to reproduce bugs
  - Include relevant error messages and logs

### Areas Where Contributions Are Welcome

- **Bug Fixes:** Help us fix bugs and improve stability
- **New Features:** Propose and implement new features
- **Documentation:** Improve documentation and add examples
- **Testing:** Add unit tests, integration tests, and improve test coverage
- **Performance:** Optimize database queries, improve response times
- **Security:** Identify and fix security vulnerabilities
- **UI/UX:** Improve the user interface and user experience
- **Accessibility:** Make the platform more accessible
- **Internationalization:** Add support for multiple languages

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

### Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing issues and discussions

Thank you for your interest in contributing to Pathfinder! 🎉

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- FastAPI team for the excellent framework
- React team for the powerful frontend library
- All contributors who have helped improve Pathfinder
- The open-source community for inspiration and support

---

## 📧 Contact

For questions, suggestions, or support, please open an issue on GitHub.

---

<div align="center">

**Made with ❤️ by the Pathfinder Team**

⭐ Star this repository if you find it helpful!

</div>
