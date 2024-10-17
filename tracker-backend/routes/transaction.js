const express = require('express');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();
const { createTransaction, getAllTransactionsById } = require('../controllers/transaction');


router.post('/transaction/create',authenticate, createTransaction);
router.get('/transactions', getAllTransactionsById)

module.exports = router;