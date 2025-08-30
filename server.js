const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware để parse JSON
app.use(express.json());

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

// 👇 Quan trọng: Gắn router vào app
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
