const express = require("express");
const cors = require("cors");// it is used to allow the frontend to access the backend
const app = express();
const config = require("./config");

// Configure CORS
app.use(cors({
    origin: [
        "http://localhost:5173",  // Local development
        "https://todo-frontend-azure-five.vercel.app/", // Your Vercel domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());//parse json bodies in the request and what does it do? it is a middleware that parses the json bodies in the request and adds them to the request object

const authRoutes = require("./routes/authRoutes");//import the authRoutes
const todoRoutes = require("./routes/todoRoutes");//import the todoRoutes

app.get("/", (req, res) => {
    res.send("API Is Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);


// Connect to MongoDB
config.connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});