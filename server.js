const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();
const mongoose = require('mongoose');

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
// ========================= API 1: List Study =========================
app.get("/listStudy", (req, res) => {
  const studyList = [
    {
      id: 1,
      title: "IELTS 17 - set 4 - passage 1,2,3",
      subtitle: "Học phần",
      wordCount: 15,
      category: "cambridge 17",
    },
    {
      id: 2,
      title: "IELTS 17 - set 3 - passage 1,2,3",
      subtitle: "Học phần",
      wordCount: 20,
      category: "cambridge 17",
    },
    {
      id: 3,
      title: "IELTS 16 - set 4 - passage 1,2,3",
      subtitle: "Học phần",
      wordCount: 22,
      category: "cambridge 16",
    },
  ];
  res.json(studyList);
});

// ========================= API 2: List Flashcard (EN-VI) =========================
router.post("/listFlashcard", (req, res) => {
  const { studyId } = req.body || {};
  if (!studyId) {
    return res.status(400).json({ error: "studyId is required" });
  }

  const flashcardsData = {
    1: [
      { id: 1, title: "Food", word: "apple", meaning: "quả táo", date: "2025-08-30" },
      { id: 2, title: "Food", word: "bread", meaning: "bánh mì", date: "2025-08-30" },
    ],
    2: [
      { id: 3, title: "School", word: "book", meaning: "quyển sách", date: "2025-08-30" },
      { id: 4, title: "School", word: "computer", meaning: "máy tính", date: "2025-08-30" },
    ],
  };

  res.json(flashcardsData[String(studyId)] || []);
});


// // ========================= API 3: Create Flashcard =========================
// router.post("/createFlashcard", (req, res) => {
//   const { word, meaning, title, description } = req.body;

//   if (!word || !meaning || !title || !description) {
//     return res.status(400).json({ error: "All fields (word, meaning, title, description) are required" });
//   }

//   // Tạo flashcard mới (giả sử ID tự động tăng)
//   const newFlashcard = {
//     id: Date.now(), // Sử dụng thời gian hiện tại làm ID
//     word,
//     meaning,
//     title,
//     description,
//     date: new Date().toISOString(),
//   };

//   // Thêm vào dữ liệu flashcardsData của học phần (cho demo)
//   // Giả sử sẽ thêm vào studyId 1 (bạn có thể tùy chỉnh theo yêu cầu thực tế)
//   const studyId = 1; // Ví dụ đang thêm vào học phần studyId 1
//   const flashcardsData = {
//     1: [
//       { id: 1, title: "Food", word: "apple", meaning: "quả táo", date: "2025-08-30" },
//       { id: 2, title: "Food", word: "bread", meaning: "bánh mì", date: "2025-08-30" },
//     ],
//     2: [
//       { id: 3, title: "School", word: "book", meaning: "quyển sách", date: "2025-08-30" },
//       { id: 4, title: "School", word: "computer", meaning: "máy tính", date: "2025-08-30" },
//     ],
//   };

//   flashcardsData[studyId].push(newFlashcard); // Thêm flashcard vào học phần

//   res.status(201).json({
//     message: "Flashcard created successfully!",
//     flashcard: newFlashcard,
//   });
// });


// 👇 Quan trọng: Gắn router vào app
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
