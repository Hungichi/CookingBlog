const mongoose = require('mongoose');
const User = require('../models/User');

const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,30}$/;
const BIO_MAX = 200;


//chi nhan link https or https va toi da 500 ky tu. Khong nhan chuoi rong va xoa AVT neu rong
const isValidUrl = (value) => {
  if (value === '') return true;
  if (value.length > 500) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};


//Profile cua chinh minh (co email)
const formatPrivateProfile = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  followersCount: user.followers.length,
  followingCount: user.following.length,
  createdAt: user.createdAt,
});


//Ho so cong khai (khong co email)
const formatPublicProfile = (user) => ({
  id: user._id,
  username: user.username,
  avatar: user.avatar,
  bio: user.bio,
  followersCount: user.followers.length,
  followingCount: user.following.length,
  createdAt: user.createdAt,
});

// GET /api/users/me
const getMyProfile = async (req, res, next) => {
  try {
    // req.user do middleware protect gan
    return res.status(200).json({
      success: true,
      data: formatPrivateProfile(req.user),
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'ID người dùng không hợp lệ' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    return res.status(200).json({
      success: true,
      data: formatPublicProfile(user),
    });
  } catch (err) {
    return next(err);
  }
};

// PUT /api/users/me
const updateMyProfile = async (req, res, next) => {
  try {
    const body = req.body || {};
    const updates = {};


    //Whilelist: chi xu ly dung 3 truong nay, cac truong khac bo qua
    if (body.username !== undefined) {
      if (typeof body.username !== 'string') {
        return res.status(400).json({ success: false, message: 'Username không hợp lệ' });
      }
      const username = body.username.trim();
      if (!USERNAME_REGEX.test(username)) {
        return res.status(400).json({
          success: false,
          message: 'Username dài 3-30 ký tự, chỉ gồm chữ, số, dấu _ và .',
        });
      }
      updates.username = username;
    }

    if (body.bio !== undefined) {
      if (typeof body.bio !== 'string') {
        return res.status(400).json({ success: false, message: 'Bio không hợp lệ' });
      }
      const bio = body.bio.trim();
      if (bio.length > BIO_MAX) {
        return res.status(400).json({
          success: false,
          message: `Bio tối đa ${BIO_MAX} ký tự`,
        });
      }
      updates.bio = bio;
    }

    if (body.avatar !== undefined) {
      if (typeof body.avatar !== 'string') {
        return res.status(400).json({ success: false, message: 'Avatar không hợp lệ' });
      }
      const avatar = body.avatar.trim();
      if (!isValidUrl(avatar)) {
        return res.status(400).json({
          success: false,
          message: 'Avatar phải là đường link http/https hợp lệ (tối đa 500 ký tự)',
        });
      }
      updates.avatar = avatar;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có trường hợp lệ để cập nhật (username, bio, avatar)',
      });
    }

    //Doi username thi kiem tra trung voi nguoi khac
    if (updates.username && updates.username !== req.user.username) {
      const existed = await User.findOne({
        username: updates.username,
        _id: { $ne: req.user._id },
      }).lean();
      if (existed) {
        return res.status(409).json({ success: false, message: 'Username đã được sử dụng' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: formatPrivateProfile(user),
    });
  } catch (err) {

    //unique index chan neu 2 nguoi cung doi sang 1 username
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Username đã được sử dụng' });
    }
    return next(err);
  }
};

module.exports = { getMyProfile, getUserProfile, updateMyProfile };