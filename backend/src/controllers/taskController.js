import Task from "../models/TaskModel.js";

export const createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find().populate("user", "email");
        } else {
            tasks = await Task.find({ user: req.user.id });
        }

        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }

        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.json(updated);
    } catch (err) {
        next(err);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }

        await task.deleteOne();

        res.json({ message: "Task deleted" });
    } catch (err) {
        next(err);
    }
};