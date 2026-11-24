const Like = require('../models/Like');
const Post = require('../models/Post');

exports.toggle = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
    }

    const existing = await Like.findOne({ user: userId, post: postId });

    if (existing) {
      await existing.deleteOne();
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      return res.json({ success: true, liked: false, likesCount: post.likesCount - 1 });
    }

    await Like.create({ user: userId, post: postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    res.json({ success: true, liked: true, likesCount: post.likesCount + 1 });
  } catch (err) {
    next(err);
  }
};

exports.status = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const existing = await Like.findOne({ user: userId, post: postId });
    res.json({ success: true, liked: !!existing });
  } catch (err) {
    next(err);
  }
};
