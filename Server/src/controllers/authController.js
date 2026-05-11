const router = require("express").Router();
const validator = require("validator");

const { parseError } = require('../utils/parser');
const { hasUser, isGuest } = require('../middlewears/quards');
const authService = require('../services/authService');
const userService = require('../services/userService');

// Register
router.post("/register", isGuest(), async (req, res) => {
  const { username, email, password } = req.body;
  
  try {

    if (validator.isEmail(email) == false) {
      throw new Error("Please enter a valid email address!");
    }

    await authService.register(username, email, password);
    
    res.json({ message: 'Please check your email to verify your account' });
  } catch (error) {
    const message = parseError(error);
    res.status(403).json({ message });
  }
})

// Login
router.post('/login', isGuest(), async (req, res) => {
    const { email, password } = req.body;

    try {
      if (email == '' || password == '') {
        throw new Error('All fields are required!');
      }
      
      if (validator.isEmail(email) == false) {
        throw new Error('Please entr a valid email address!');
      }
      
      const user = await authService.login(email, password);
      
      res.json(user);
    } catch (error) {
      const message = parseError(error);
      res.status(403).json({ message });
    }
})

// Log out
router.get('/logout', hasUser(), async (req, res) => {
  const token = req.token;
  await authService.logout(token);
  res.status(204).end();
})

// Edit profile
router.put('/edit-profile', hasUser(), async (req, res) => {
  const { userId, data } = req.body;

  try {
    const user = await userService.editUser(userId, data);
    
    res.json(user);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Change password
router.put('/chg-password', hasUser(), async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  
  try {
    const user = await authService.chgPassword(email, oldPassword, newPassword);

    res.json(user);
    res.end();
  } catch (error) {
    const message = parseError(error);
    res.status(403).json({ message });
  }
})

// Delete user
router.delete('/delete/:userId', async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.userId);

    if (user) {
      res.json({ message: 'User successfully deleted' });
    } else {
      res.json({ message: 'Something went wrong' });
    }
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

module.exports = router;