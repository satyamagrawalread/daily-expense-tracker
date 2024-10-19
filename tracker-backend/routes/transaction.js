const express = require('express');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();
const { createTransaction, getAllTransactionsById, getCurrentMonthTransactions, getLastWeekTransactions } = require('../controllers/transaction');


router.post('/transaction/create',authenticate, createTransaction);
router.get('/transactions', authenticate, getAllTransactionsById)
router.get('/current/month', authenticate, getCurrentMonthTransactions);
router.get('/lastweek', authenticate, getLastWeekTransactions);

module.exports = router;