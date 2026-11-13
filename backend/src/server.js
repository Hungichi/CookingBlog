require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

//neu deploy thi server se nam sau proxy, ta set de lay dung IP ng dung
app.set('trust proxy', 1);

app.use(helmet());

//cho phep nhieu domain, ngan cach = dau phay trong CLIENT_URL
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      //neu khong co origin postman thi goi server to server
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));


//route kiem tra server (nen tang deploy hay dung)
app.get('/', (req, res) => res.send('CookingBlog API running'));
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use('/api/auth', authRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Không tìm thấy endpoint' });
});

// xu ly loi chung
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'Origin không được phép' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'JSON gửi lên không hợp lệ' });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Lỗi server' });
});

const PORT = process.env.PORT || 5000;

// ket noi DB xong thi moi mo cong DB
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});