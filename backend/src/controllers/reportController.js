const mongoose = require('mongoose');
const Report = require('../models/Report');
const AdminLog = require('../models/AdminLog');
const { REPORT_TARGETS, REPORT_STATUSES } = require('../models/Report');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason } = req.body;

    if (!REPORT_TARGETS.includes(targetType)) {
      return res.status(400).json({ success: false, message: 'Loại nội dung không hợp lệ' });
    }
    if (!isValidId(targetId)) {
      return res.status(400).json({ success: false, message: 'ID nội dung không hợp lệ' });
    }
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập lý do' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
    });

    res.status(201).json({ success: true, data: report });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Bạn đã báo cáo nội dung này rồi' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    next(err);
  }
};

exports.listReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && REPORT_STATUSES.includes(status)) filter.status = status;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('reporter', 'username avatar')
        .lean(),
      Report.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }
    if (!REPORT_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const update = { status };
    if (typeof adminNote === 'string') update.adminNote = adminNote;

    const report = await Report.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy báo cáo' });
    }

    await AdminLog.create({
      admin: req.user._id,
      action: `report.${status}`,
      targetType: 'Report',
      targetId: report._id,
      details: adminNote || '',
    });

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy báo cáo' });
    }

    await AdminLog.create({
      admin: req.user._id,
      action: 'report.delete',
      targetType: 'Report',
      targetId: report._id,
    });

    res.json({ success: true, message: 'Đã xóa báo cáo' });
  } catch (err) {
    next(err);
  }
};