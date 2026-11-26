const mongoose = require('mongoose');
const { Schema } = mongoose;

const REPORT_TARGETS = ['Post', 'Comment', 'User'];
const REPORT_STATUSES = ['pending', 'resolved', 'dismissed'];

const reportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // targetType la ten model, dung refPath de populate dung collection
    targetType: {
      type: String,
      enum: { values: REPORT_TARGETS, message: 'Loại nội dung bị báo cáo không hợp lệ' },
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, refPath: 'targetType', required: true },
    reason: {
      type: String,
      required: [true, 'Lý do báo cáo là bắt buộc'],
      trim: true,
      maxlength: [300, 'Lý do tối đa 300 ký tự'],
    },
    status: { type: String, enum: REPORT_STATUSES, default: 'pending' },
    adminNote: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });
// moi user chi bao cao 1 noi dung 1 lan
reportSchema.index({ reporter: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
module.exports.REPORT_TARGETS = REPORT_TARGETS;
module.exports.REPORT_STATUSES = REPORT_STATUSES;