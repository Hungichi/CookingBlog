const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
    // lấy thêm tokenVersion
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +tokenVersion');

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
    const token = jwt.sign({ id: user._id, tv: user.tokenVersion }, process.env.JWT_SECRET, {
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
const logout = async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
    return res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
  } 
  catch (err) {
    return next(err);
  }
};


const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
    }

    // Luôn trả cùng một thông báo để không lộ email nào đã đăng ký
    const genericResponse = {
      success: true,
      message: 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu',
    };

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    
    //Token goc chi gui qua email, DB chi luu ban hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    await User.updateOne(
      { _id: user._id },
      {
        resetPasswordToken: hashToken(rawToken),
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
      }
    );


    //CLIENT_URL co the chua nhieu domain, ta lay domain dau tien
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
    const resetLink = `${clientUrl}/reset-password?token=${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'CookingBlog - Đặt lại mật khẩu',
        html: `
          <p>Xin chào ${user.username},</p>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu. Bấm vào link bên dưới (có hiệu lực trong 15 phút):</p>
          <p><a href="${resetLink}">Đặt lại mật khẩu</a></p>
          <p>Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
        `,
      });
    } catch (mailErr) {

      //Gui mail loi thi xoa toekn de khong ton tai token vo chu
      await User.updateOne(
        { _id: user._id },
        { $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } }
      );
      console.error('Send email error:', mailErr.message);
      return res.status(500).json({ success: false, message: 'Không gửi được email, thử lại sau' });
    }

    return res.status(200).json(genericResponse);
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/reset-password   body: { token, password }
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body || {};

    if (typeof token !== 'string' || typeof password !== 'string' || !token) {
      return res.status(400).json({ success: false, message: 'Thiếu token hoặc mật khẩu mới' });
    }
    if (password.length < 6 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải từ 6 đến 72 ký tự',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //Kiem tra token, vua doi mat khau, vua xoa token
    //Token chi dung duoc mot lan, ke ca khi 2 request gui cung luc
    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken: hashToken(token),
        resetPasswordExpires: { $gt: new Date() },
      },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
        $inc: { tokenVersion: 1 }, // //vo hieu hoa token cu
      }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công, vui lòng đăng nhập lại',
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login, logout, forgotPassword, resetPassword };