const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, trim: true, lowercase: true }, 
    section: { type: String, required: true, trim: true }, 
    content: { type: mongoose.Schema.Types.Mixed, required: true }, 
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

siteContentSchema.index({ page: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);