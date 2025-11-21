import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember, 
  removeTeamMember,
  getProjectOverview
} from "../controllers/projectController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin + Manager can create projects
router.post("/", protect, authorizeRoles("admin", "manager"), createProject);

// Everyone logged in can view
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);

// Admin + Manager can update/delete
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateProject);
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteProject);

// Add member
router.post("/:id/team", protect, authorizeRoles("admin", "manager"), addTeamMember);

// Remove member
router.delete("/:id/team", protect, authorizeRoles("admin", "manager"), removeTeamMember);

// Project Overview
router.get("/:id/overview", protect, getProjectOverview);

export default router;
