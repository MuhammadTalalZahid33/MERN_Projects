import Task from "../models/Task.js";
import Project from "../models/Project.js";

// CREATE TASK
// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { project, assignedTo } = req.body;

    // 1. Validate project
    const projectData = await Project.findById(project);
    if (!projectData)
      return res.status(404).json({ message: "Project not found" });

    // 2. Validate user assignment
    if (assignedTo && !projectData.team.includes(assignedTo)) {
      return res
        .status(400)
        .json({ message: "User is not part of this project team" });
    }

    // 3. Create task
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET TASKS BY PROJECT
export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    // If updating assignedTo, validate membership
    if (req.body.assignedTo) {
      const project = await Project.findById(task.project);

      if (!project.team.includes(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "User is not part of this project team" });
      }
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
