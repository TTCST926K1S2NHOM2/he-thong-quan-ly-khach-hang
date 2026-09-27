const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);

// API phân quyền
app.use('/api/permissions', permissionRoutes);

// Test server
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend đang hoạt động',
  });
});

module.exports = app;