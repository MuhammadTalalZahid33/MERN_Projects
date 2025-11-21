import Project from "../models/Project.js";
import Task from "../models/Task.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description, team } = req.body;

    const project = await Project.create({
      title,
      description,
      team,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("team", "name email role")
      .populate("createdBy", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("team", "name email role")
      .populate("createdBy", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD TEAM MEMBER
export const addTeamMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Prevent duplicates
    if (project.team.includes(req.body.userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    project.team.push(req.body.userId);
    await project.save();

    res.json({ message: "Member added", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE TEAM MEMBER
export const removeTeamMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    project.team = project.team.filter(
      (member) => member.toString() !== req.body.userId
    );

    await project.save();

    res.json({ message: "Member removed", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PROJECT OVERVIEW
export const getProjectOverview = async (req, res) => {
  try {
    const projectId = req.params.id;

    // 1. Get project with team info
    const project = await Project.findById(projectId)
      .populate("team", "name email role");

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    // 2. Get tasks for this project
    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    // 3. Group tasks by status
    const grouped = {
      todo: tasks.filter((t) => t.status === "todo"),
      inProgress: tasks.filter((t) => t.status === "in-progress"),
      done: tasks.filter((t) => t.status === "done"),
    };

    // 4. Stats
    const total = tasks.length;
    const doneCount = grouped.done.length;
    const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

    // 5. Upcoming deadlines
    const upcoming = tasks
      .filter((t) => t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5); // limit to next 5 deadlines

    // 6. Return dashboard data
    res.json({
      project,
      team: project.team,
      stats: {
        totalTasks: total,
        todo: grouped.todo.length,
        inProgress: grouped.inProgress.length,
        done: doneCount,
        completion: progress,
      },
      groupedTasks: grouped,
      upcomingDeadlines: upcoming,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};