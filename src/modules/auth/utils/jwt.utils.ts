import * as jwt from 'jsonwebtoken';
import * as process from "node:process";

export function generateAccessToken(payload: { userId: number; email: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: { userId: number; email: string }) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
