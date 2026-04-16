# 🚀 Full Stack Task Management App

A full-stack application built with **Node.js, Express, MongoDB (Backend)** and **React + Vite + Tailwind CSS (Frontend)**.  
It supports authentication, role-based access (User/Admin), and CRUD operations for tasks.

---

## 📌 Features

- 🔐 User Authentication (JWT-based)
- 👥 Role-Based Access Control (User & Admin)
- 📝 Task Management (Create, Read, Update, Delete)
- 🎯 Admin Dashboard (access to all tasks)
- ⚡ Modern UI with React + Tailwind CSS
- 🔄 Persistent login using localStorage

---

## 🏗️ Project Structure
root/
├── backend/
├── frontend/



---

## 🔧 Backend Structure (Express + MongoDB)


backend/
├── src/
│ ├── controllers/ # Business logic (auth, tasks)
│ ├── models/ # Mongoose schemas (User, Task)
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & role-based middleware
│ ├── utils/ # Helper functions (token, hashing)
│ └── config/ # DB connection
├── server.js # Entry point
├── package.json
└── .env


### 🔑 Key Backend Features

- JWT Authentication
- Password hashing using bcrypt
- Role-based middleware (admin/user)
- RESTful API design
- MongoDB for data storage

---

## 🎨 Frontend Structure (React + Vite + Tailwind)
frontend/
├── src/
│ ├── pages/ # Login, Register, Dashboard, Admin
│ ├── context/ # Auth context (global state)
│ ├── api/ # Axios configuration
│ ├── components/ # Reusable UI components
│ ├── App.jsx # Routing logic
│ └── main.jsx # Entry point
├── index.html
├── package.json
└── vite.config.js


### 💡 Frontend Features

- React Router for navigation
- Protected routes
- Role-based redirection
- Toast notifications
- Responsive UI using Tailwind CSS

---

## 👤 Roles & Access

### 🧑 User
- Can create tasks
- Can view only their tasks
- Can update/delete their tasks

### 👑 Admin
- Can view all users' tasks
- Can update/delete any task
- Has access to Admin Dashboard

---

## ⚠️ Admin Role (Current Implementation)

- Admin role is currently **manually assigned via MongoDB**
- You can update a user’s role by editing:

- Working url :-https://aivoa-frontend.onrender.com/
```json
"role": "admin"

🔮 Future Improvements
Dedicated API to create/update admin users
Role management UI
Better access control system
Pagination & filtering
Docker deployment
Logging & monitoring
⚙️ Setup Instructions
Backend
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
🌐 Deployment
Backend: Render
Frontend: Vercel
📌 Notes
Make sure .env is properly configured
Use correct API base URL in frontend
Add vercel.json for routing support
🙌 Conclusion

This project demonstrates:

Scalable backend architecture
Secure authentication system
Clean frontend integration
Role-based access control

🔥 Built as part of Backend Developer Assignment

