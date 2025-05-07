🛠 Step-by-Step Plan
1️⃣ Backend Setup (Node.js + Express + MongoDB)
➤ Features to Build:
POST /api/register → Register user

POST /api/login → Login user + return JWT

GET /api/todos → Get all todos (auth protected)

POST /api/todos → Create new todo

PUT /api/todos/:id → Edit todo

DELETE /api/todos/:id → Delete todo

➤ Things You'll Learn:
JWT Auth (jsonwebtoken)

Password hashing (bcryptjs)

Middleware (for auth check)

MongoDB models with Mongoose

2️⃣ Frontend Setup (React)
➤ Pages to Build:
/register → Signup form

/login → Login form

/todos → Todo dashboard (protected route)

/add-todo or inline add/edit in the dashboard

➤ Concepts You'll Practice:
useState, useEffect

React Router

Handling forms and JWT storage (in localStorage or cookies)

API calls with fetch or axios

Conditional rendering (loading, error, auth check)

💡 Bonus (Optional):
Once you're done, add:

✅ Logout button

📝 Mark todo as completed

🔐 Role-based access (admin-only actions)

🌙 Dark mode





todo-backend/
├── controllers/
│   └── authController.js
│   └── todoController.js
├── models/
│   └── User.js
│   └── Todo.js
├── routes/
│   └── authRoutes.js
│   └── todoRoutes.js
├── middleware/
│   └── authMiddleware.js
├── .env
├── server.js
