const Todo = require("../models/Todo");

// Create a new todo
const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const todo = await Todo.create({
            title,
            description,
            owner: req.user._id
        });
        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create todo",
            error: error.message,
        });
    }
}

// Get all todos for authenticated user
const getAllTodo = async (req, res) => {
    try {
        const todos = await Todo.find({ owner: req.user._id })
            .sort({ createdAt: -1 }); // -1 for descending order (newest first)
        res.status(200).json({
            success: true,
            message: "All todos fetched successfully",
            todos,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch todos",
            error: error.message,
        })
    }   
}

// Get a single todo by ID
const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOne({ _id: id, owner: req.user._id });
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Todo fetched successfully",
            todo,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch todo",
            error: error.message,
        }); 
    }
}

// Update a todo by ID
const updateTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const todo = await Todo.findOneAndUpdate(
            { _id: id, owner: req.user._id },
            { title, description, completed },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }   
        res.status(200).json({  
            success: true,
            message: "Todo updated successfully",
            todo,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update todo",
            error: error.message,
        });
    }
}

// Delete a todo by ID
const deleteTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, owner: req.user._id });
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            todo,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete todo",
            error: error.message,
        });
    }
}

const searchTodo = async (req, res) => {
    try {
        const { query } = req.query;
        const todos = await Todo.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, // Case-insensitive title search
                { description: { $regex: query, $options: "i" } }, // Case-insensitive description search
            ]
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search todo",
            error: error.message,
        });
    }
}

module.exports = {
    createTodo,
    getAllTodo,
    getTodoById,
    updateTodoById,
    deleteTodoById,
    searchTodo
}
