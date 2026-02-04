const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          error: "Access denied: no role information.",
        });
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: "Access denied: insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        error: "Role authorization error.",
      });
    }
  };
};

// Default export
export default roleMiddleware;

// Named export
export const authorizeRoles = roleMiddleware;
