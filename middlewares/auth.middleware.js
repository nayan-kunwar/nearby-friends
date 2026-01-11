import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};
