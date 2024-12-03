const express = require('express');
const router = express.Router();
const {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels,
} = require('../controller/controller');
 
// Define routes
router.post('/api/categories', create_Categories);
router.get('/api/categories', get_Categories);
router.post('/api/transaction', create_Transaction);
router.get('/api/transaction', get_Transaction);
router.delete('/api/transaction', delete_Transaction);
router.get('/api/labels', get_Labels);

module.exports = router;
