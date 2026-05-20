const router = require('express').Router();
const crypto = require('crypto');

const userService = require('../services/userService');
const parseError = require('../utils/parser');
const { generateEmailToken, hashPass } = require('../services/authService');
const { sendVerificationEmail } = require('../services/mailService');

const FRONTEND_URL = process.env.FRONTEND__URL;

router.get('/verify-email/:token', async (req, res) => {
  const token = req.params.token;
  
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  const payload = {
    emailVerificationTokenHash: hash,
    emailVerificationExpires: { $gt: Date.now() }
  };

  try {
    const user = await userService.findUserByToken(payload);

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    user.isVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();
    res.json({ message: 'Your email was confirmed successfully'});
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
});

router.post('/forgot-password/:email', async (req, res) => {
  const email = req.params.email;
  
  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.json({ message: 'If account exists, email was sent' });
    };

    const { token, hash } = generateEmailToken();

    user.passwordResetTokenHash = hash;
    user.passwordResetExpires = Date.now() + 1000 * 60 * 30;

    await user.save();
    
    const link = `${FRONTEND_URL}/renew/${token}`;
    const title = 'Reset your password';
    const content = 'Click the link below:';
    
    await sendVerificationEmail(user.email, link, title, content);

    res.json({ message: 'If account exists, email was sent' });
  } catch (error) {
  const message = parseError(error);
  res.status(400).json({ message });
  };
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  const hash = crypto.createHash('sha256').update(token).digest('hex')

  const user = await userService.findUserByResetToken({
  passwordResetTokenHash: hash,
  passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  
  user.hashedPassword = await hashPass(newPassword);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.json({ message: 'Password reset successfully' });
});

module.exports = router;
