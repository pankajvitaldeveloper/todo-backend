const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,       
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,//this is the type of the owner field
        required: true,
        ref: 'User'//this is the reference to the User model
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
