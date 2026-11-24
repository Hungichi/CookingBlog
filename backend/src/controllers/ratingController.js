const Rating = require('../models/Rating');
const Post = require('../models/Post');

exports.rate = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { value } = req.body;
    const userId = req.user._id;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ success: false, message: 'Điểm đánh giá phải từ 1 đến 5' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
    }

    const existing = await Rating.findOne({ user: userId, post: postId });

    if (existing) {
      const oldValue = existing.value;
      existing.value = value;
      await existing.save();

      const ratingSum = (post.ratingAvg * post.ratingCount) - oldValue + value;
      const ratingAvg = Math.round((ratingSum / post.ratingCount) * 10) / 10;
      await Post.findByIdAndUpdate(postId, { ratingAvg });

      return res.json({ success: true, ratingAvg, ratingCount: post.ratingCount, userRating: value });
    }

    await Rating.create({ user: userId, post: postId, value });

    const newCount = post.ratingCount + 1;
    const ratingSum = (post.ratingAvg * post.ratingCount) + value;
    const ratingAvg = Math.round((ratingSum / newCount) * 10) / 10;
    await Post.findByIdAndUpdate(postId, { ratingAvg, ratingCount: newCount });

    res.json({ success: true, ratingAvg, ratingCount: newCount, userRating: value });
  } catch (err) {
    next(err);
  }
};

exports.getUserRating = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findOne({ user: userId, post: postId });
    res.json({ success: true, userRating: rating ? rating.value : null });
  } catch (err) {
    next(err);
  }
};
