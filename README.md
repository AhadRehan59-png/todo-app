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

## Installation

1. Clone or copy the project folder
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root with:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
```

4. Start the server

```bash
node app.js
```

## Usage

- Visit `http://localhost:3000/signup` to create an account
- Visit `http://localhost:3000/login` to sign in
- After login, go to `http://localhost:3000/tasks` to manage tasks

## Project Structure

- `app.js` - main Express application
- `config/db.js` - MongoDB connection
- `models/` - Mongoose models for `User` and `Task`
- `routes/` - authentication and task routes
- `middlewares/` - route guards like `isLoggedIn`
- `views/` - EJS templates for pages
- `public/` - static assets

## Notes

- Update the session secret in `app.js` before deploying
- Ensure MongoDB is running and `MONGODB_URI` is correct
- There is no test command configured yet
