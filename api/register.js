const crypto = require('crypto');
const mysql = require('mysql2/promise');

// MD5 hash function matching Java Utils.md5()
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password, gender } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập tên tài khoản và mật khẩu.' });
  }

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  if (cleanUser.length < 3 || cleanUser.length > 20) {
    return res.status(400).json({ success: false, message: 'Tên tài khoản phải từ 3 đến 20 ký tự.' });
  }

  if (cleanPass.length < 4) {
    return res.status(400).json({ success: false, message: 'Mật khẩu phải từ 4 ký tự trở lên.' });
  }

  // Database config from environment variables (configured on Vercel) or fallback
  const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'avatar_2x',
    connectTimeout: 5000
  };

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if user exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [cleanUser]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Tên tài khoản này đã được sử dụng!' });
    }

    const hashedPass = md5(cleanPass);
    const chosenGender = parseInt(gender || '0', 10); // 0 = nam, 1 = nu

    // Insert user
    const [result] = await connection.execute(
      'INSERT INTO users (username, password, role, active, login_lock) VALUES (?, ?, 0, 1, 0)',
      [cleanUser, hashedPass]
    );

    const newUserId = result.insertId;

    // Insert corresponding player record
    await connection.execute(
      'INSERT INTO players (user_id, level_main, gender, scores, is_online) VALUES (?, 1, ?, 0, 0)',
      [newUserId, chosenGender]
    );

    return res.status(200).json({
      success: true,
      message: 'Đăng ký tài khoản ' + cleanUser + ' thành công!'
    });
  } catch (error) {
    console.error('Database register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Không thể kết nối đến cơ sở dữ liệu: ' + (error.message || 'Lỗi server')
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
