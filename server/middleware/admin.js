// Admin middleware: only allows users with role "admin".
// Use this after "protect" so that req.user is already set.
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { admin };
