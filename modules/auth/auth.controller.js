import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "./auth.model.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await Auth.create({ email, password: hashed });

  res.status(201).json({ message: "User created" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Auth.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  // 🍪 Set cookie
  res.cookie("token", token, {
    httpOnly: true, // JS cannot access
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ token });
};
