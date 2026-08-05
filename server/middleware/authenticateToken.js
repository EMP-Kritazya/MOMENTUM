import jwt from "jsonwebtoken";

// Verifies the httpOnly auth cookie and exposes its JWT payload to controllers.
export function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication",
    });
  }
}
