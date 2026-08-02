import jwt from "jsonwebtoken";

// Verifies a Bearer token and attaches its payload to the request.
// export function authenticateToken(req, res, next) {
//   // Splits "Bearer <token>" into its authentication scheme and token.
//   const authorization = req.get("authorization");
//   const [scheme, token] = authorization?.split(" ") ?? [];

//   if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({
//       message: "Authentication required",
//     });
//   }

//   try {
//     // Rejects tokens that are invalid, changed, or expired.
//     req.auth = jwt.verify(token, process.env.JWT_SECRET);
//     return next();
//   } catch (error) {
//     return res.status(403).json({
//       message: "Invalid or expired token",
//     });
//   }
// }

export function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      error: error.message,
    });
  }
}
