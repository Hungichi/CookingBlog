const mongoose = require('mongoose');
const { Schema } = mongoose;

const POST_TYPES = ['recipe', 'story'];
const POST_STATUSES = ['draft', 'published', 'hidden'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

function isRecipe() {
  return this.type === 'recipe';
}

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên nguyên liệu là bắt buộc'],
      trim: true,
      maxlength: 100,
    },
    quantity: { type: Number, min: [0, 'Số lượng không được âm'] },
    unit: { type: String, trim: true, maxlength: 30, default: '' },
  },
  { _id: false }
);

const stepSchema = new Schema(
  {
    order: { type: Number, min: 1 },
    content: {
      type: String,
      required: [true, 'Nội dung bước nấu là bắt buộc'],
      trim: true,
      maxlength: 2000,
    },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    type: {
      type: String,
      enum: { values: POST_TYPES, message: 'Loại bài viết không hợp lệ' },
      required: true,
      default: 'recipe',
    },
    title: {
      type: String,
      required: [true, 'Tiêu đề là bắt buộc'],
      trim: true,
      minlength: [3, 'Tiêu đề quá ngắn'],
      maxlength: [150, 'Tiêu đề tối đa 150 ký tự'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Mô tả ngắn tối đa 500 ký tự'],
      default: '',
    },
    content: {
      type: String,
      required: [
        function () {
          return this.type === 'story';
        },
        'Nội dung bài viết là bắt buộc',
      ],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục là bắt buộc'],
    },
    tags: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
    coverImage: {
      type: String,
      required: [true, 'Ảnh đại diện là bắt buộc'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featured: { type: Boolean, default: false },
    prepTime: { type: Number, min: 0, required: [isRecipe, 'Thời gian chuẩn bị là bắt buộc'] },
    cookTime: { type: Number, min: 0, required: [isRecipe, 'Thời gian nấu là bắt buộc'] },
    servings: { type: Number, min: 1, required: [isRecipe, 'Khẩu phần là bắt buộc'] },
    difficulty: {
      type: String,
      enum: { values: DIFFICULTIES, message: 'Độ khó không hợp lệ' },
      required: [isRecipe, 'Độ khó là bắt buộc'],
    },
    ingredients: {
      type: [ingredientSchema],
      default: undefined,
      required: [isRecipe, 'Công thức phải có danh sách nguyên liệu'],
      validate: {
        validator(v) {
          return this.type !== 'recipe' || (Array.isArray(v) && v.length > 0);
        },
        message: 'Công thức phải có ít nhất 1 nguyên liệu',
      },
    },
    steps: {
      type: [stepSchema],
      default: undefined,
      required: [isRecipe, 'Công thức phải có các bước thực hiện'],
      validate: {
        validator(v) {
          return this.type !== 'recipe' || (Array.isArray(v) && v.length > 0);
        },
        message: 'Công thức phải có ít nhất 1 bước thực hiện',
      },
    },
    status: {
      type: String,
      enum: POST_STATUSES,
      default: 'published',
    },
    views: { type: Number, default: 0, min: 0 },
    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('totalTime').get(function () {
  if (this.type !== 'recipe') return undefined;
  return (this.prepTime || 0) + (this.cookTime || 0);
});

postSchema.pre('validate', function () {
  if (this.type === 'story') {
    this.prepTime = undefined;
    this.cookTime = undefined;
    this.servings = undefined;
    this.difficulty = undefined;
    this.ingredients = undefined;
    this.steps = undefined;
  } else if (Array.isArray(this.steps)) {
    this.steps.forEach((step, i) => {
      step.order = i + 1;
    });
  }
});

postSchema.index({ status: 1, type: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
module.exports.POST_TYPES = POST_TYPES;
module.exports.POST_STATUSES = POST_STATUSES;
module.exports.DIFFICULTIES = DIFFICULTIES;
