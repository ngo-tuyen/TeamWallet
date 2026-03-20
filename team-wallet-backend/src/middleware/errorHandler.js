// グローバルエラーハンドラー
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
};

// 404ハンドラー (ルートが見つからない)
export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};
