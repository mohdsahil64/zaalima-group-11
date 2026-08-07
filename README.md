# AI-Powered Applicant Tracking System (ATS)

A production-ready, enterprise-grade Applicant Tracking System built with modern technologies.

## Tech Stack

### Frontend
- React 19 + Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hook Form
- Framer Motion

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Express Validator

## Project Structure

```
ats-project/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable components
│   │   │   ├── common/     # Buttons, Inputs, Cards
│   │   │   ├── forms/      # Form components
│   │   │   ├── layout/     # Navbar, Sidebar, Layouts
│   │   │   └── ui/         # UI primitives
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout wrappers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── routes/         # Route configuration
│   │   ├── context/        # React Context providers
│   │   ├── constants/      # App constants
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles
│   │   └── types/          # Type definitions
│   └── ...
├── server/                  # Express Backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── middlewares/        # Custom middlewares
│   ├── validators/         # Request validators
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads directory
│   └── database/           # Database seeders/migrations
└── ...
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ats-project
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd client
npm install
```

4. Set up environment variables
```bash
cp .env.example server/.env
```

5. Start the development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

### Available Scripts

#### Backend (server/)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint

#### Frontend (client/)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/forgot-password` - Forgot password
- `PUT /api/v1/auth/reset-password/:token` - Reset password

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update profile
- `PUT /api/v1/users/change-password` - Change password

### Jobs
- `GET /api/v1/jobs` - Get all jobs
- `GET /api/v1/jobs/:id` - Get single job
- `POST /api/v1/jobs` - Create job (Recruiter)
- `PUT /api/v1/jobs/:id` - Update job (Recruiter)
- `DELETE /api/v1/jobs/:id` - Delete job (Recruiter)

### Applications
- `GET /api/v1/applications` - Get applications
- `POST /api/v1/applications` - Submit application (Applicant)
- `PUT /api/v1/applications/:id/status` - Update status (Recruiter)

## Design System

- **Font:** Inter
- **Primary Color:** #4F46E5
- **Background:** #0F172A
- **Card Background:** #1E293B
- **Border:** #334155
- **Text:** #F8FAFC
- **Secondary Text:** #94A3B8
- **Border Radius:** 12px

## Security

- JWT-based authentication with HTTP-only cookies
- bcrypt password hashing
- Helmet security headers
- CORS configuration
- Input validation & sanitization
- Role-based access control (Admin, Recruiter, Applicant)
- Environment variable management

## License

MIT
