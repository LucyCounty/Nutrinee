import express from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import userRoutes from "./routes/user.route.js";
import weightHistoryRoutes from "./routes/weight_history.route.js";
import exerciseDataRoutes from "./routes/exercise_data.route.js";
import loginRoute from "./routes/login.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json()); 

app.use("/api/userinfo", userRoutes);
app.use("/api/weighthistory", weightHistoryRoutes);
app.use("/api/exercisedata", exerciseDataRoutes);
app.use("/api/login", loginRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});