require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

require('./config/passport');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './src/views'); // Set views directory

// Serve static files from the "src/public" directory
app.use(express.static(path.join(__dirname, 'src/views')));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('dashboard', { user: req.user });
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
