import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const clearCache = () => {
//   Object.keys(require.cache).forEach((key) => {
//     delete require.cache[key];
//   });
//   console.log("Cache cleared");
// };

// // Clear cache every hour (3600000 milliseconds)
// setInterval(clearCache, 60000);


app.get("/", (req, res) => {
  res.send("Class_Suru_Backend");
});


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}, Link ${BACKEND_URL}`);
});
