const express = require("express");
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware để parse JSON
app.use(express.json());

// Kết nối MongoDB
const mongoURI = 'mongodb+srv://flashcardUser:hieu181020@FlashCard.iknr9ht.mongodb.net/?retryWrites=true&w=majority&appName=FlashCard';
// const mongoURI = 'mongodb+srv://flashcardUser:hieu181020@FlashCard.mongodb.net/flashcardDB?retryWrites=true&w=majority '
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,  // Tăng thời gian timeout
}).then(() => {
  console.log('MongoDB connected successfully!');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
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
// app.get("/listStudy", async (req, res) => {
//   try {
//     // Truy vấn tất cả flashcards từ MongoDB
//     const flashcards = await Flashcard.find();  // Tìm tất cả flashcards trong collection flashcards
//     res.json(flashcards);  // Trả về dữ liệu flashcards
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch flashcards", details: error });
//   }
// });
app.get('/listStudy', async (req, res) => {
  try {
    // Truy vấn tất cả các study từ database
    const studies = await Flashcard.find();

    // Định dạng dữ liệu và trả về kết quả
    const result = studies.map((study, index) => ({
      id: index + 1,  // Tạo id tự động
      title: study.title,
      subtitle: study.description || 'Học phần',  // Nếu không có subtitle, gán mặc định
      wordCount: study.terms.length,  // Tính wordCount từ số lượng terms
      category: study.category || 'cambridge',  // Nếu không có category, gán mặc định
    }));

    res.json(result);  // Trả về kết quả
  } catch (err) {
    res.status(500).json({ error: 'Error fetching study data', details: err });
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
app.post('/createFlashcard', async (req, res) => {
  const { title, description, terms } = req.body;

  // Kiểm tra các trường
  if (!title || !description || !terms || terms.length === 0) {
    console.error('Missing fields: ', { title, description, terms });
    return res.status(400).json({ error: 'All fields (title, description, and terms) are required.' });
  }

  try {
    const newFlashcard = new Flashcard({
      title,
      description,
      terms,
    });

    // Lưu vào MongoDB
    await newFlashcard.save();
    
    res.status(201).json({
      message: 'Flashcard created successfully!',
      flashcard: newFlashcard,
    });
  } catch (error) {
    console.error('Error creating flashcard:', error);  // In chi tiết lỗi
    res.status(500).json({
      error: 'Failed to create flashcard',
      details: error.toString(),  // Gửi chi tiết lỗi từ phía server
    });
  }
});



// Gắn router vào app
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
