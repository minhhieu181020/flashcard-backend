const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// API 1: List các bài học
app.get("/listStudy", (req, res) => {
  const studyList = [
    // { id: 1, title: "IELTS 17 - set 4 - passage 1,2,3", numberOfWords: "13"},
    // { id: 2, title: "IELTS 17 - set 2 - passage 1,2,3" , numberOfWords: "12"},
    // { id: 3, title: "Lesson 3: Vocabulary for Travel", numberOfWords: "24" },
    // { id: 4, title: "Lesson 4: Daily Conversation", numberOfWords: "9" },
  ];
  res.json(studyList);
});

// API 2: List Flashcard (EN - VI)
app.get("/listFlashcard", (req, res) => {
  const flashcards = [
    { id: 1, word: "apple", meaning: "quả táo" },
    { id: 2, word: "book", meaning: "quyển sách" },
    { id: 3, word: "computer", meaning: "máy tính" },
    { id: 4, word: "school", meaning: "trường học" },
  ];
  res.json(flashcards);
});
// API 3: Tạo danh sách 


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});