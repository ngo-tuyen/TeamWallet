import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "12h";

// JWTトークンを生成
export const generateToken = (user_id, email) => {
  return jwt.sign(
    {
      user_id,
      email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE,
    },
  );
};

// JWTトークンを検証
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// トークンが期限切れかチェック
export const isTokenExpired = (token) => {
  try {
    jwt.verify(token, JWT_SECRET);
    return false;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return true;
    }
    return false;
  }
};
