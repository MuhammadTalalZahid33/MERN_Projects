import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// test route
app.get('/', (req, res) => {
  res.send("API Working 🚀");
});

// connect db
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
