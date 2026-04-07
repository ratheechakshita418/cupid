# Cupid - AI-Powered Dating App

A modern dating application for university students featuring AI-powered personality matching, real-time chat, and compatibility scoring.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Personality Matching**: AI-driven compatibility based on MBTI and Big Five traits
- **Real-time Chat**: Instant messaging with typing indicators and online status
- **Profile Management**: Editable profiles with personality breakdowns
- **Discovery**: Card-based swiping interface for finding matches
- **Responsive Design**: Mobile-first design with glassmorphism effects

## Tech Stack

### Frontend
- React 18.2.0
- React Router DOM
- Axios for API calls
- Socket.io-client for real-time features
- CSS Modules for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:
   - Copy `backend/.env` and update MongoDB URI and JWT secret

4. Start the development servers:

```bash
# From root directory
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/questionnaire` - Submit personality questionnaire

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/discover` - Get potential matches
- `GET /api/users/matches` - Get user's matches

### Messages
- `POST /api/messages/send` - Send a message
- `GET /api/messages/:recipientId` - Get conversation
- `PUT /api/messages/read/:recipientId` - Mark messages as read

### Personality
- `GET /api/personality` - Get all questions
- `GET /api/personality/:id` - Get specific question

## Socket Events

### Client to Server
- `user_online` - User comes online
- `send_message` - Send message to recipient
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `user_online` - Notify when user comes online
- `user_offline` - Notify when user goes offline
- `receive_message` - Receive new message
- `message_sent` - Confirm message sent
- `typing_start` - Show typing indicator
- `typing_stop` - Hide typing indicator

## Project Structure

```
cupid/
├── backend/
│   ├── config/
│   │   ├── personalityEngine.js
│   │   └── questions.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── matches.js
│   │   ├── messages.js
│   │   └── personality.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Deployment

### Prerequisites
- MongoDB Atlas account (for cloud database)
- Hosting accounts: Vercel (frontend) + Railway/Heroku (backend)

### Database Setup
1. Create a MongoDB Atlas cluster
2. Get your connection string and update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cupid?retryWrites=true&w=majority
   ```

### Backend Deployment (Railway)
1. Push backend code to GitHub
2. Connect Railway to your GitHub repo
3. Set environment variables in Railway:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.vercel.app`
4. Deploy - Railway will auto-deploy on push

### Frontend Deployment (Vercel)
1. Push frontend code to GitHub
2. Connect Vercel to your GitHub repo
3. Set environment variable:
   - `REACT_APP_API_URL=https://your-backend-domain.railway.app`
4. Deploy - Vercel will build and deploy automatically

### Alternative: Heroku Deployment
```bash
# Backend
cd backend
heroku create cupid-backend
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
git push heroku main

# Frontend
cd ../frontend
npm install -g vercel
vercel --prod
```

### Environment Variables
Update `backend/.env` for production:
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

Update `frontend/.env`:
```
REACT_APP_API_URL=https://your-backend-domain.com
```
