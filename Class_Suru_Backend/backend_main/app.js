import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";  

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Class_Suru_Backend");
});


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}, Link ${BACKEND_URL}`);
});
