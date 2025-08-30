const express = require("express");
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware để parse JSON
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/flashcardDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Schema và Model cho Flashcard
const flashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  meaning: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "No description provided" },
  date: { type: Date, default: Date.now },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

// Schema và Model cho Study
const studySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  wordCount: { type: Number, required: true },
  category: { type: String, required: true },
});

const Study = mongoose.model("Study", studySchema);

// ========================= API 1: List Study =========================
app.get("/listStudy", async (req, res) => {
  try {
    const studyList = await Study.find();  // Lấy tất cả các study từ MongoDB
    res.json(studyList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch studies", details: error });
  }
});

// ========================= API 2: List Flashcard (EN-VI) =========================
router.post("/listFlashcard", (req, res) => {
  const { studyId } = req.body || {};
  if (!studyId) {
    return res.status(400).json({ error: "studyId is required" });
  }

  // Truy vấn flashcards từ MongoDB (Tương tự API listStudy)
  Flashcard.find({ studyId })
    .then(flashcards => {
      res.json(flashcards);
    })
    .catch(err => {
      res.status(500).json({ error: "Failed to fetch flashcards", details: err });
    });
});

// ========================= API 3: Create Flashcard =========================
router.post("/createFlashcard", async (req, res) => {
  const { word, meaning, title, description } = req.body;

  if (!word || !meaning || !title || !description) {
    return res.status(400).json({ error: "All fields (word, meaning, title, description) are required" });
  }

  // Tạo flashcard mới
  const newFlashcard = new Flashcard({
    word,
    meaning,
    title,
    description,
  });

  try {
    // Lưu flashcard vào MongoDB
    await newFlashcard.save();
    res.status(201).json({
      message: "Flashcard created successfully!",
      flashcard: newFlashcard,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create flashcard", details: error });
  }
});

// Gắn router vào app
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
