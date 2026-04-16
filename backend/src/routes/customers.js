const express = require('express');
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, customerController.listCustomers);
router.post('/', authMiddleware, customerController.createCustomer);
router.get('/:id', authMiddleware, customerController.getCustomer);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

module.exports = router;
