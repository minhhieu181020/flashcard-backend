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
  title: { type: String, required: true, unique: true },  // Đảm bảo title là duy nhất
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

app.get('/listStudy', async (req, res) => {
  try {
    // Truy vấn tất cả các study từ database
    const studies = await Flashcard.find();

    // Định dạng dữ liệu và trả về kết quả
    const result = studies.map((study, index) => ({
      id: study.id,  //id tu database
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
  const { title } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  // Truy vấn flashcards từ MongoDB theo title
  Flashcard.find({ title })
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

  // Kiểm tra các trường bắt buộc
  if (!title || !description || !terms || terms.length === 0) {
    console.error('Missing fields: ', { title, description, terms });
    return res.status(400).json({ error: 'All fields (title, description, and terms) are required.' });
  }

  try {
    // Kiểm tra xem title có bị trùng hay không
    const existingFlashcard = await Flashcard.findOne({ title });

    if (existingFlashcard) {
      return res.status(400).json({ error: 'Flashcard with this title already exists.' });
    }

    // Nếu title không trùng, tạo flashcard mới
    const newFlashcard = new Flashcard({
      title,
      description,
      terms,
    });

    // Lưu flashcard vào MongoDB
    await newFlashcard.save();

    res.status(201).json({
      message: 'Flashcard created successfully!',
      flashcard: newFlashcard,
    });
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({
      error: 'Failed to create flashcard',
      details: error.toString(),
    });
  }
});




// Gắn router vào app
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
