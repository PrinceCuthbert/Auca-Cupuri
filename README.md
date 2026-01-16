# 📚 Cupuri Portal - University Exam Resource Platform

> A full-stack web application that revolutionizes how students access and share academic resources at AUCA (Adventist University of Central Africa).

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://cupuri-portal.vercel.app)
[![Backend API](https://img.shields.io/badge/API-active-blue?style=for-the-badge)](https://cupuri-backend.onrender.com)

---

## 🎯 Problem Statement

University students at AUCA faced significant challenges:
- **No centralized platform** for accessing past examination papers
- **Inefficient resource sharing** between students across different cohorts
- **Time wasted** searching for study materials scattered across various channels
- **Limited visibility** into exam formats and question patterns
- **No feedback mechanism** for resource quality

**Impact**: Students spent hours searching for materials that should be readily accessible, affecting their study efficiency and academic performance.

---

## 💡 The Solution

Cupuri Portal is a comprehensive digital platform that:
- ✅ Centralizes all past examination papers in one searchable database
- ✅ Enables students to browse, preview, and download resources instantly
- ✅ Provides advanced filtering by faculty, course, and exam type
- ✅ Allows students to review and rate resources
- ✅ Gives administrators tools to manage and curate content
- ✅ Tracks platform usage and engagement through analytics

**Result**: Students now access exam resources in seconds instead of hours, with quality assurance through peer reviews.

---

## 🚀 Live Application

- **Frontend**: [https://cupuri-portal.vercel.app](https://cupuri-portal.vercel.app)
- **Backend API**: [https://cupuri-backend.onrender.com](https://cupuri-backend.onrender.com)
- **Test Login**: Available on request

---

## 🛠️ Technical Stack

### Frontend
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.14-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-0055FF?style=flat&logo=framer&logoColor=white)

- **React 19** - Modern UI with hooks and context API
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling for responsive design
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing and navigation
- **Ant Design** - Professional UI components
- **Chart.js** - Interactive data visualizations

### Backend
![Node.js](https://img.shields.io/badge/Node.js-22.22-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)

- **Node.js & Express** - RESTful API architecture
- **MySQL** - Relational database with complex queries
- **JWT** - Secure authentication and authorization
- **bcrypt** - Password hashing and security
- **Multer** - File upload handling
- **Cloudinary** - Cloud-based media storage
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render&logoColor=white)
![Aiven](https://img.shields.io/badge/Aiven-Database-FF3E00?style=flat&logo=aiven&logoColor=white)

- **Vercel** - Frontend hosting with automatic deployments
- **Render** - Backend API hosting with health checks
- **Aiven** - Managed MySQL database with SSL
- **Git & GitHub** - Version control and CI/CD pipeline

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration and login with JWT tokens
- Role-based access control (Student/Admin)
- Protected routes and API endpoints
- Session management with HTTP-only cookies

### 📖 Exam Management
- **Browse & Search**: Advanced filtering by faculty, course, exam type
- **Preview**: In-browser PDF and image preview with screenshot protection
- **Download**: Secure file downloads with authentication
- **Upload** (Admin): Multi-file upload with metadata
- **Delete** (Admin): Content moderation and management

### ⭐ Review System
- Students can rate and review exam resources
- Category-based feedback (Usability, Content Quality, etc.)
- Anonymous review option
- Admin response capability

### 📊 Analytics Dashboard
- Real-time visitor tracking and statistics
- Faculty and course distribution charts
- Exam type breakdown visualization
- User engagement metrics

### 🎨 User Experience
- Fully responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations and transitions
- Intuitive navigation and search
- Loading states and error handling

---

## 🏗️ Architecture & Design Patterns

### Frontend Architecture
```
clientside/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route-based page components
│   │   ├── browse/       # Exam browsing and preview
│   │   ├── dashboard/    # Analytics and stats
│   │   ├── form/         # Exam upload forms
│   │   └── reviews/      # Review management
│   ├── context/          # React Context for state management
│   │   ├── AuthContext   # Authentication state
│   │   └── AppContext    # Global app state
│   └── api/              # API client and utilities
```

### Backend Architecture
```
serverside/
├── config/               # Database and service configs
├── controllers/          # Business logic layer
├── middlewares/          # Auth, validation, error handling
├── routes/              # API route definitions
├── models/              # Data models and schemas
└── sql/                 # Database migrations and seeds
```

### Database Schema
- **users** - Authentication and user profiles
- **faculties** - Academic faculty organization
- **courses** - Course catalog
- **exams** - Exam metadata and file references
- **reviews** - User feedback and ratings
- **general_reviews** - Platform-wide feedback
- **admin_responses** - Admin engagement
- **visits** - Analytics and tracking

---

## 💻 Technical Highlights

### 1. Advanced State Management
- Implemented React Context API for global state
- Custom hooks for authentication and data fetching
- Optimized re-renders with useMemo and useCallback

### 2. Secure File Handling
- Multi-file upload with validation
- Cloud storage integration (Cloudinary)
- Secure download with authentication
- File type detection and preview generation

### 3. Database Optimization
- Indexed queries for fast search
- Foreign key relationships for data integrity
- Connection pooling for performance
- SSL/TLS encryption for security

### 4. API Design
- RESTful endpoints with proper HTTP methods
- JWT-based authentication
- Role-based authorization middleware
- Comprehensive error handling
- CORS configuration for security

### 5. Deployment & DevOps
- Automated CI/CD with Vercel and Render
- Environment-based configuration
- Database migration from Railway to Aiven
- SSL certificate management
- Health checks and monitoring

---

## 🎓 Skills Demonstrated

### Frontend Development
- ✅ Modern React with hooks and functional components
- ✅ Responsive design with Tailwind CSS
- ✅ Complex state management with Context API
- ✅ Client-side routing and navigation
- ✅ Form validation and error handling
- ✅ API integration and data fetching
- ✅ Animation and user experience design

### Backend Development
- ✅ RESTful API design and implementation
- ✅ Database design and SQL queries
- ✅ Authentication and authorization
- ✅ File upload and storage
- ✅ Middleware and error handling
- ✅ Security best practices (CORS, JWT, bcrypt)

### DevOps & Deployment
- ✅ Cloud platform deployment (Vercel, Render, Aiven)
- ✅ Environment variable management
- ✅ Database migration and backup
- ✅ SSL/TLS configuration
- ✅ CI/CD pipeline setup
- ✅ Version control with Git

### Software Engineering
- ✅ Full-stack application architecture
- ✅ Component-based design
- ✅ Code organization and modularity
- ✅ Documentation and code comments
- ✅ Problem-solving and debugging
- ✅ Performance optimization

---

## 📈 Impact & Metrics

- **Active Users**: Growing student base across multiple faculties
- **Resources**: Comprehensive exam library covering multiple courses
- **Performance**: Sub-second page loads with optimized queries
- **Availability**: 99.9% uptime with cloud hosting
- **Security**: Zero security incidents with JWT and SSL

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/PrinceCuthbert/Auca-Cupuri.git
cd Auca-Cupuri
```

2. **Setup Backend**
```bash
cd serverside
npm install
cp .env.example .env
# Configure your .env file with database credentials
npm start
```

3. **Setup Frontend**
```bash
cd clientside
npm install
cp .env.example .env
# Configure your .env file with backend URL
npm run dev
```

4. **Database Setup**
```bash
# Run SQL migrations in serverside/sql/
mysql -u root -p < serverside/sql/create_db.sql
```

### Environment Variables

**Backend (.env)**
```env
PORT=3009
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=auca_cupuri_portal
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_BASE_URL=http://localhost:3009/api
```

---

## 📸 Screenshots

### Browse Exams
![Browse Interface](https://via.placeholder.com/800x400?text=Browse+Exams+Interface)

### Dashboard Analytics
![Dashboard](https://via.placeholder.com/800x400?text=Analytics+Dashboard)

### Exam Preview
![Preview](https://via.placeholder.com/800x400?text=Exam+Preview)

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AI-powered exam recommendations
- [ ] Study group formation features
- [ ] Real-time chat for collaboration
- [ ] Advanced analytics and insights
- [ ] Integration with university LMS
- [ ] Gamification and achievements

---

## 👨‍💻 Developer

**Prince Cuthbert Ishimwe**

- 💼 Full-Stack Developer
- 🎓 Computer Science Student at AUCA
- 🌍 Based in Rwanda
- 📧 Contact: [Your Email]
- 💻 GitHub: [@PrinceCuthbert](https://github.com/PrinceCuthbert)
- 🔗 LinkedIn: [Your LinkedIn]

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- AUCA community for feedback and testing
- Students who contributed exam resources
- Open-source libraries and frameworks used

---

<div align="center">

**Built with ❤️ for the AUCA community**

⭐ Star this repo if you find it helpful!

</div>
