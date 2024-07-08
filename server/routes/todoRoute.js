const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const { cacheTodos, setTodosCache, invalidateTodosCache } = require('../middlewares/redisMiddleware.js');
const Todo = require('../models/todoModel.js');
const User = require('../models/userModel.js');

// Get user data
router.get("/get-user", authMiddleware, async (req, res) => {
    const userId = req.body.userId;
    try {
        const isUser = await User.findOne({ _id: userId });
        if (!isUser) {
            return res.sendStatus(401);
        }
        return res.json({ user: isUser, message: "User details retrieved successfully" });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Add todo
router.post('/add-todo', authMiddleware, async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags || [],
            userId: req.body.userId,
        });
        await todo.save();
        invalidateTodosCache();
        res.status(200).send({ message: 'Todo added successfully', success: true, data: todo });
    } catch (error) {
        res.status(500).send({ message: 'Error adding todo', success: false, data: error });
    }
});

// Edit todo
router.put('/edit-todo/:todoId', authMiddleware, async (req, res) => {
    const todoId = req.params.todoId;
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: todoId, userId: req.body.userId },
            { title: req.body.title || todo.title, content: req.body.content || todo.content, tags: req.body.tags || todo.tags },
            { new: true }
        );
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found', success: false });
        }
        invalidateTodosCache();
        res.status(200).send({ message: 'Todo updated successfully', success: true, data: todo });
    } catch (error) {
        res.status(500).send({ message: 'Error updating todo', success: false, data: error });
    }
});

// Update isPinned
router.put('/update-todo-pinned/:todoId', authMiddleware, async (req, res) => {
    const todoId = req.params.todoId;
    const { isPinned } = req.body;
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: todoId, userId: req.body.userId },
            { isPinned: isPinned },
            { new: true }
        );
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found', success: false });
        }
        invalidateTodosCache();
        res.status(200).send({ message: 'Todo pinned status updated successfully', success: true, data: todo });
    } catch (error) {
        res.status(500).send({ message: 'Error updating pinned status', success: false, data: error });
    }
});

// Get all todos
router.get('/get-all-todos', authMiddleware, cacheTodos, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.body.userId }).sort({ isPinned: -1 });
        setTodosCache(todos); // Set Redis cache
        res.status(200).send({ message: 'All todos retrieved successfully', success: true, data: todos });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching todos', success: false, data: error });
    }
});

// Delete todo
router.delete('/delete-todo/:todoId', authMiddleware, async (req, res) => {
    const todoId = req.params.todoId;
    try {
        const todo = await Todo.findOneAndDelete({ _id: todoId, userId: req.body.userId });
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found', success: false });
        }
        invalidateTodosCache();
        res.status(200).send({ message: 'Todo deleted successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting todo', success: false, data: error });
    }
});

// Search todos
router.get('/search-todos', authMiddleware, async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send({ message: 'Search query is required', success: false });
    }
    try {
        const matchingTodos = await Todo.find({
            userId: req.body.userId,
            $or: [
                { title: { $regex: new RegExp(query, 'i') } }, 
                { content: { $regex: new RegExp(query, 'i') } }, 
            ],
        });
        res.status(200).send({ message: 'Todos matching the search query retrieved successfully', success: true, data: matchingTodos });
    } catch (error) {
        res.status(500).send({ message: 'Error searching todos', success: false, data: error });
    }
});

module.exports = router;



