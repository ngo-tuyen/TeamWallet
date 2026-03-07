import { verifyToken } from "../utils/jwt.js";

// JWT認証ミドルウェア
export const authMiddleware = (req, res, next) => {
  // Authorization ヘッダーからトークンを取得
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // トークンを検証
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // ユーザー情報をリクエストオブジェクトに追加
  req.user = decoded;
  next();
};

// 別名エクスポート (互換性のため)
export const authenticate = authMiddleware;

// オプションの認証ミドルウェア (トークンがなくてもOK)
export const optionalAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};
