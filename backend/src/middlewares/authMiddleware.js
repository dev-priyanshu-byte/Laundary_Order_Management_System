module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  // TODO: validate token and attach user to req.user
  req.user = { id: 'demo-user', role: 'admin' };
  next();
};
