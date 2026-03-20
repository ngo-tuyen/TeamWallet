import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 10;

// パスワードをハッシュ化
export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// パスワードを検証
export const verifyPassword = async (password, hash) => {
  try {
    const isMatch = await bcryptjs.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw new Error("Error verifying password");
  }
};

// ランダムなパスワードを生成
export const generateRandomPassword = (length = 12) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
