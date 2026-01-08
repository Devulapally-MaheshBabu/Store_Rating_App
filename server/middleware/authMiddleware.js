const jwt = require("jsonwebtoken");
const SECRET_KEY = "super_secret_key";

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ error: "A token is required for authentication" });
  }

  try {
    const actualToken = token.split(" ")[1];
    const decoded = jwt.verify(actualToken, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

exports.checkRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient permissions" });
  }
  next();
};
