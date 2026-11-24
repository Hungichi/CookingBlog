const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,30}$/;

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};

    // phai la chuoi, chan cac kieu gui object tan cong nosql inject
    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đủ username, email và password',
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // validate
    if (!USERNAME_REGEX.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: 'Username dài 3-30 ký tự, chỉ gồm chữ, số, dấu _ và .',
      });
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
    }
    // bcrypt chi xu ly max 72 byte nen can gioi han do dai
    if (password.length < 6 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải từ 6 đến 72 ký tự',
      });
    }

    // kiem tra trung
    const existed = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    }).lean();

    if (existed) {
      const field = existed.email === cleanEmail ? 'Email' : 'Username';
      return res.status(409).json({
        success: false,
        message: `${field} đã được sử dụng`,
      });
    }

    // hash password va luu
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    // respone
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    // tranh nhieu ng dang ky cung` username hay email cung luc
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email hoặc username đã được sử dụng',
      });
    }
    return next(err);
  }
};

//login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và password',
      });
    }

    // password co select: false nen ta phai .select('+password') 
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

    const invalidMsg = 'Email hoặc mật khẩu không đúng';
    if (!user) {
      return res.status(401).json({ success: false, message: invalidMsg });
    }

    //so khop password trong db va password user nhap
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: invalidMsg });
    }

    //tao token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

//logout
const logout = (req, res) => {
  return res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
};

module.exports = { register, login, logout };