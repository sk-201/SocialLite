# Problem Statement
Build a simple social feed system like Twitter Lite 
Frontend 
Post creation UI (text + image optional) 
Feed listing (newest first) 
Like/Comment UI 
Real-time updates with WebSockets/long-polling 
Backend 
JWT Auth 
API for posts, likes, comments 
Rate limiting for posting 
Database 
Tables: users, posts, comments, likes

# Social Lite

App built with React, Material-UI, Node.js, Express, and MongoDB.

## Prerequisites

- Node.js
- npm

## Setup Instructions

### 1. Install Both  Dependencies at the same time 

```bash
npm run install-all
```

Or you can install them separately


### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Create  `backend/.env` file:
I have provided the .env file on the email just paste it in the backend directory.

Open two terminals and start the servers separately  by using both commands below.

### 5. Start Backend Server

```bash
npm run start-backend
```

Backend will run on http://localhost:5000

### 6. Start Frontend Development Server

```bash
npm run start-frontend
```

Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `POST /api/posts` - Create new post (with rate limiting)
- `DELETE /api/posts/:id` - Delete post

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/post/:postId` - Get comments for post
- `DELETE /api/comments/:id` - Delete comment

### Likes
- `POST /api/likes/:postId` - Toggle like
- `GET /api/likes/:postId/check` - Check if user liked post
- `GET /api/likes/:postId/users` - Get users who liked post


## Tech Stack

### Frontend
- React 18
- Material-UI (MUI) 5
- React Router 6
- Axios
- WebSocket API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- ws for WebSocket support
- express-rate-limit for rate limiting

## App Flow

- First you have to register with a username, email and password . 
You can use any email even a fake one it has  to be in an email format only
- You can create a post, comment on a post, like a post.
- You can delete a post as well and delete your comment only.

