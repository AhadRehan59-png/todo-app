# Todo App

A simple Todo application built with Node.js, Express, EJS, MongoDB, and user authentication.

## Features

- User signup and login
- JWT-based cookie authentication
- Add, edit, and list tasks
- Search, filter, sort, and paginate tasks
- Task priority, status, and due date support
- Flash messages for success and error notifications

## Technologies

- Node.js
- Express
- EJS
- MongoDB / Mongoose
- bcrypt
- express-session
- connect-flash
- node

## Installation

1. Clone or copy the project folder
2. Change into the backend folder

```bash
cd backend
```

3. Install backend dependencies

```bash
npm install
```

4. Create a `.env` file in the project root with:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
```

5. Start the backend server

```bash
npm start
```

## Usage

- Visit `http://localhost:3000/signup` to create an account
- Visit `http://localhost:3000/login` to sign in
- After login, go to `http://localhost:3000/tasks` to manage tasks

## Project Structure

- `backend/` - server application and Node.js backend code
  - `backend/app.js` - main Express application
  - `backend/config/db.js` - MongoDB connection
  - `backend/models/` - Mongoose models for `User` and `Task`
  - `backend/routes/` - authentication and task routes
  - `backend/middlewares/` - route guards like `isLoggedIn`
  - `backend/utils/` - helper utilities
- `frontend/` - frontend assets and views
  - `frontend/views/` - EJS templates for pages
  - `frontend/public/` - static assets like CSS and HTML

## Notes

- Update the session secret in `app.js` before deploying
- Ensure MongoDB is running and `MONGODB_URI` is correct
- There is no test command configured yet
