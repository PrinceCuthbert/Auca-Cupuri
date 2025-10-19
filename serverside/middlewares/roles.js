export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("Role check:", { user: req.user, allowedRoles });

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden - Role '${
          req.user.role
        }' not allowed. Required: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

// Shortcut middleware for admin-only routes
export const isAdmin = permit("admin");
