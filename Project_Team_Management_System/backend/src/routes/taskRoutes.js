import express from "express";
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a task (admin + manager)
router.post("/", protect, authorizeRoles("admin", "manager"), createTask);

// Get all tasks for project
router.get("/project/:projectId", protect, getTasksByProject);

// Get single task
router.get("/:id", protect, getTaskById);

// Update task
router.put("/:id", protect, updateTask);

// Delete task
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteTask);

export default router;
