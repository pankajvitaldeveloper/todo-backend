const express = require("express");
const router = express.Router();
const { createTodo, getAllTodo, getTodoById, updateTodoById, deleteTodoById, searchTodo } = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all todo routes
router.use(authMiddleware);

router.post("/", createTodo);
router.get("/", getAllTodo);
router.get("/:id", getTodoById);
router.put("/:id", updateTodoById);
router.delete("/:id", deleteTodoById);
router.get("/search/:key", searchTodo);

module.exports = router;
