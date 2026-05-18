const bcrypt = require("bcrypt");
const crypto = require('crypto');

const User = require("../Models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const { sign, verify } = require('../lib/jwt');
const { sendVerificationEmail } = require("../services/mailService");

const API_URL = process.env.BACKEND_URL;
const tokenBlackList = new Set();

function generateEmailToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  return { token, hash };
}

function hashPass(password) {
  return bcrypt.hash(password, 10);
}

function createRole(email) {
  if (email === 'a.pavlov@ipoma.com') {
    return 'admin';
  }
  
  if (email.split('@')[1].split('.')[0] === 'ipoma') {
    return 'ipoma-user';
  } else {
    return 'user';
  }
}

// Register
async function register(username, email, password) {
  const isUsernameExists = await User.findOne({ username });
  
  if (isUsernameExists == true) {
    throw new Error("This user name is already exists in DB!");
  }
  
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists == true) {
    throw new Error("This email is already exists in DB!");
  }
  
  const hashedPassword = await hashPass(password);
  const { token, hash } = generateEmailToken();
  const role = createRole(email);

  await User.create({
    username,
    email,
    role,
    hashedPassword,
    emailVerificationTokenHash: hash,
    emailVerificationExpires: Date.now() + 1000 * 60 * 60
  })

  const link = `${API_URL}/api/verify-email/${token}`;
  const title = 'Verify your email';
  const content = 'Click to confirm your email:';

  await sendVerificationEmail(email, link, title, content);
}

// Login
async function login(email, password) {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error("Email or password is not correct");
  }

  const isHashMatch = await bcrypt.compare(password, user.hashedPassword);

  if (!isHashMatch) {
    throw new Error("Email or password is not correct");
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }

  return createToken(user);
}

// Logout
async function logout(token) {
  tokenBlackList.add(token);
}

// Change password
async function chgPassword(email, oldPassword, newPassword) {
  const user = await User.findOne({ email });
  
  const isHashMatch = await bcrypt.compare(oldPassword, user.hashedPassword);

  if (!isHashMatch) {
    throw new Error('Wrong old password');
  }

  const data = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  }

  const newHashedPass = await hashPass(newPassword);

  const freshUser = {
    hashedPassword: newHashedPass
  }

  await User.findByIdAndUpdate(user._id, freshUser, { runValidators: true,  new: true });
  
  return createToken(data);
}

// Create token
async function createToken({ _id, email, username, role }) {
  const payload = {
    _id,
    email,
    username,
    role
  }

  return {
    _id,
    email,
    username,
    role,
    accessToken: await sign(payload, JWT_SECRET),
  }
}

// Verify token
async function verifyToken(token) {
  if (tokenBlackList.has(token)) {
    throw new Error("Token is blacklisted");
  }
  return await verify(token, JWT_SECRET);
};

module.exports = {
  register,
  hashPass,
  login,
  logout,
  chgPassword,
  createToken,
  verifyToken,
  generateEmailToken
};
