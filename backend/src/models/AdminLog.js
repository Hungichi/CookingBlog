const mongoose = require('mongoose');
const { Schema } = mongoose;

// Nhat ky thao tac cua admin (khoa user, xoa bai, xu ly report...)
const adminLogSchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true, trim: true }, // vd: 'report.resolve', 'post.delete'
    targetType: { type: String, trim: true }, // 'Post' | 'Comment' | 'User' | 'Report'
    targetId: { type: Schema.Types.ObjectId },
    details: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

adminLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);