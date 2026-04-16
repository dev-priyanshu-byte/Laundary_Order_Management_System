const express = require('express');
const authRoutes = require('./auth');
const orderRoutes = require('./orders');
const customerRoutes = require('./customers');
const laundryRoutes = require('./laundries');
const dashboardRoutes = require('./dashboard');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/laundries', laundryRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Laundry Order Management API' });
});

module.exports = router;
