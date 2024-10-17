const express = require('express');
const app = express();
const cors = require('cors')
const connectDB = require('./database/db_connect');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transaction');
const categoryRoutes = require('./routes/categories');

PORT = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use(cors({
    origin: '*'
}))
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use(transactionRoutes);
app.use(categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})