const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Tên là bắt buộc'], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    subject: { type: String, trim: true, maxlength: 150, default: '' },
    message: { type: String, required: [true, 'Nội dung là bắt buộc'], trim: true, maxlength: 2000 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);