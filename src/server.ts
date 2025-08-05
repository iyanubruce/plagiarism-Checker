import express from "express";
import cors from "cors";
import path from "path";
import plagiarismRouter from "./routes/plagiarism.routes";
import recommendRouter from "./routes/recommend.routes";
import citationRouter from "./routes/citation.routes"; // Add this import

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));

// Routes
app.use("/api", plagiarismRouter);
app.use("/api", recommendRouter);
app.use("/api", citationRouter); // Add this line

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Research Assistant API running on http://localhost:${PORT}`);
});
