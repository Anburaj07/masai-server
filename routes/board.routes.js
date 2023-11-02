const express = require("express");
const { BoardModel } = require("../models/board.model");
const { TaskModel } = require("../models/task.model");
const { SubtaskModel } = require("../models/subtask.model");
const boardRouter = express.Router();

boardRouter.get("/", async (req, res) => {
    try {
        const boards = await BoardModel.find().populate({
          path: 'tasks',
          populate: { path: 'subtasks' }
        });
    
        res.json({ boards });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

boardRouter.post("/add", async (req, res) => {
  try {
    const { boards } = req.body;

    if (!boards || !Array.isArray(boards)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    
    for (const boardData of boards) {
      const { name, tasks } = boardData;

      if (!name || !tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Invalid board format" });
      }

      const newBoard = new BoardModel({ name });
      newBoard.tasks = []; 

      for (const taskData of tasks) {
        const { title, description, status, subtasks } = taskData;

        if (!title || !status || !subtasks || !Array.isArray(subtasks)) {
          return res.status(400).json({ error: "Invalid task format" });
        }

        const newTask = new TaskModel({ title, description, status });
        newTask.subtasks = []; 

        for (const subtaskData of subtasks) {
          const { title: subtaskTitle, isCompleted } = subtaskData;

          if (!subtaskTitle || typeof isCompleted !== "boolean") {
            return res.status(400).json({ error: "Invalid subtask format" });
          }

          const newSubtask = new SubtaskModel({
            title: subtaskTitle,
            isCompleted,
          });
          await newSubtask.save();

          newTask.subtasks.push(newSubtask);
        }

        await newTask.save();

        newBoard.tasks.push(newTask);
      }

      await newBoard.save();
    }

    res.status(201).json({ message: "Boards created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { boardRouter };
