const orderModel = require('../models/orderModel');

exports.getDashboardSummary = async () => {
  const orders = orderModel.findAll();
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const statusCounts = orders.reduce((counts, order) => {
    const status = order.status || 'UNKNOWN';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  const averageOrderValue = totalOrders === 0 ? 0 : revenue / totalOrders;

  return {
    totalOrders,
    revenue,
    averageOrderValue,
    ordersPerStatus: statusCounts,
    statusCounts,
  };
};
