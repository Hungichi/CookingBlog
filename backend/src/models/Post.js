const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['recipe', 'story'], required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    coverImage: { type: String, default: '' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    // Recipe-specific fields
    prepTime: { type: Number },
    cookTime: { type: Number },
    servings: { type: Number },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    ingredients: [
      {
        name: { type: String },
        quantity: { type: String },
        unit: { type: String },
      },
    ],
    instructions: [
      {
        stepNumber: { type: Number },
        content: { type: String },
        imageUrl: { type: String },
      },
    ],
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    // Story-specific fields
    body: { type: String },
    images: [{ url: String, caption: String }],
  },
  { timestamps: true }
);

postSchema.virtual('rating').get(function () {
  if (this.ratingCount === 0) return 0;
  return Math.round((this.ratingSum / this.ratingCount) * 10) / 10;
});

postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
