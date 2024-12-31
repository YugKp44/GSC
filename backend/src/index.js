require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

require('./config/passport');

const app = express();

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`
    <h1>Welcome ${req.user.name}</h1>
    <p>Email: ${req.user.email}</p>
    <a href="/auth/logout">Logout</a>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});