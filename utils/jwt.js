import { jwt } from "jsonwebtoken";

export function generateAccessToken(id) {
  return jwt.sign({
    userId: id
  }, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
}