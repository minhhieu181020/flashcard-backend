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
 title: { type: String, required: true },
  description: { type: String, required: true },
  terms: [
    {
      term: { type: String, required: true },
      meaning: { type: String, required: true }
    }
  ],
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
    // Truy vấn tất cả flashcards từ MongoDB
    const flashcards = await Flashcard.find();  // Tìm tất cả flashcards trong collection flashcards
    res.json(flashcards);  // Trả về dữ liệu flashcards
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flashcards", details: error });
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
  const { title, description, terms } = req.body;

  // Kiểm tra nếu thiếu các trường bắt buộc hoặc `terms` không phải là mảng
  if (!title || !description || !Array.isArray(terms) || terms.length === 0) {
    return res.status(400).json({ error: "All fields (title, description, and terms) are required and terms must be an array" });
  }

  // Tạo flashcard mới
  const newFlashcard = new Flashcard({
    title,
    description,
    terms,  // Mảng terms đã được gửi lên
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
