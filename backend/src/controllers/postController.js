const Post = require('../models/Post');

exports.list = async (req, res, next) => {
  try {
    const { type, sort, featured, limit = 12, page = 1, search, categoryId } = req.query;

    const filter = { status: 'published' };
    if (type) filter.type = type;
    if (featured === 'true') filter.featured = true;
    if (categoryId) filter.categoryId = categoryId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { 'likes.length': -1, createdAt: -1 };
    if (sort === 'rating') sortOption = { ratingSum: -1, createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'username avatar')
        .lean(),
      Post.countDocuments(filter),
    ]);

    const data = posts.map((p) => ({
      ...p,
      author: p.userId,
      userId: undefined,
      rating: p.ratingCount > 0 ? Math.round((p.ratingSum / p.ratingCount) * 10) / 10 : 0,
    }));

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.featured = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'published', featured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('userId', 'username avatar')
      .lean();

    const data = posts.map((p) => ({
      ...p,
      author: p.userId,
      userId: undefined,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
