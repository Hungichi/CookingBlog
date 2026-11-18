const Post = require('../models/Post');

exports.list = async (req, res, next) => {
  try {
    const { type, sort, featured, limit = 12, page = 1, search, categoryId } = req.query;

    const filter = { status: 'published' };
    if (type) filter.type = type;
    if (featured === 'true') filter.featured = true;
    if (categoryId) filter.category = categoryId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { likesCount: -1, createdAt: -1 };
    if (sort === 'rating') sortOption = { ratingAvg: -1, createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'username avatar')
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
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
      .populate('author', 'username avatar')
      .lean();

    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};
