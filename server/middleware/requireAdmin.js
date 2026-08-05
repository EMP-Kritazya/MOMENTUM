// Allows the request to continue only when the JWT contains the admin role.
export function requireAdmin(req, res, next) {
  if (req.auth?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }
  return next();
}
