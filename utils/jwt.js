import jwt from "jsonwebtoken";

export function generateAccessToken(id, role) {
  return jwt.sign({
    userId: id,
    role: role //include user role
  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}