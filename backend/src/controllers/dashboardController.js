const dashboardService = require('../services/dashboardService');

exports.getDashboard = async (req, res, next) => {
  try {
    const summary = await dashboardService.getDashboardSummary();
    res.json({ data: summary });
  } catch (error) {
    next(error);
  }
};
