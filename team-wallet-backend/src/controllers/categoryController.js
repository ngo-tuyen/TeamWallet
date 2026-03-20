import pool from "../config/database.js";

// カテゴリーを作成
export const createCategory = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { category_name } = req.body;

    // バリデーション
    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // チームが存在するかチェック
    const [teams] = await pool.query(
      "SELECT team_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 同一チーム内で同じカテゴリー名が存在するかチェック
    const [existingCategory] = await pool.query(
      "SELECT category_id FROM expense_categories WHERE team_id = ? AND category_name = ?",
      [team_id, category_name],
    );

    if (existingCategory.length > 0) {
      return res
        .status(400)
        .json({ message: "Category already exists in this team" });
    }

    // カテゴリーを作成
    const [result] = await pool.query(
      "INSERT INTO expense_categories (team_id, category_name) VALUES (?, ?)",
      [team_id, category_name],
    );

    res.status(201).json({
      message: "Category created successfully",
      category: {
        category_id: result.insertId,
        team_id,
        category_name,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Error creating category" });
  }
};

// カテゴリー一覧を取得
export const getCategories = async (req, res) => {
  try {
    const { team_id } = req.params;

    // チームが存在するかチェック
    const [teams] = await pool.query(
      "SELECT team_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    // カテゴリー一覧を取得
    const [categories] = await pool.query(
      "SELECT category_id, category_name FROM expense_categories WHERE team_id = ? ORDER BY created_at ASC",
      [team_id],
    );

    res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// カテゴリーを削除
export const deleteCategory = async (req, res) => {
  try {
    const { team_id, category_id } = req.params;

    // カテゴリーが存在するかチェック
    const [categories] = await pool.query(
      "SELECT category_id FROM expense_categories WHERE category_id = ? AND team_id = ?",
      [category_id, team_id],
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // カテゴリーを削除
    await pool.query(
      "DELETE FROM expense_categories WHERE category_id = ? AND team_id = ?",
      [category_id, team_id],
    );

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
};
