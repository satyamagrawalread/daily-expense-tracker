const express = require('express');
const router = express.Router();
const { getAllCategories, addCategory } = require('../controllers/category');

router.get('/categories', getAllCategories);
router.post('/addcategory', addCategory);

module.exports = router;