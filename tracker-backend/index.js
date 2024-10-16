const express = require('express');
const app = express();
const cors = require('cors')
const connectDB = require('./database/db_connect');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
PORT = process.env.PORT || 8080;

connectDB();
app.use(express.json());

app.use('auth', authRoutes);
app.use('user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})