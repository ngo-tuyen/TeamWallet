import pool from "../config/database.js";

// 支出を追加
export const createExpense = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { category_id, amount, expense_date, notes } = req.body;
    const { user_id } = req.user;

    // バリデーション
    if (!category_id || !amount || !expense_date) {
      return res
        .status(400)
        .json({
          message: "Category ID, amount, and expense_date are required",
        });
    }

    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    // チームが存在するかチェック
    const [teams] = await pool.query(
      "SELECT team_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    // カテゴリーが存在するかチェック
    const [categories] = await pool.query(
      "SELECT category_id, category_name FROM expense_categories WHERE category_id = ? AND team_id = ?",
      [category_id, team_id],
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 支出を追加
    const [result] = await pool.query(
      "INSERT INTO expenses (team_id, user_id, category_id, amount, expense_date, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [team_id, user_id, category_id, amount, expense_date, notes || null],
    );

    res.status(201).json({
      message: "Expense added successfully",
      expense: {
        expense_id: result.insertId,
        team_id,
        user_id,
        category_id,
        category_name: categories[0].category_name,
        amount,
        expense_date,
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ message: "Error creating expense" });
  }
};

// 支出一覧を取得
export const getExpenses = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { month, category_id } = req.query;

    // チームが存在するかチェック
    const [teams] = await pool.query(
      "SELECT team_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 条件で支出一覧を取得
    let query = `SELECT e.expense_id, e.user_id, u.full_name, e.category_id, c.category_name, e.amount, e.expense_date, e.notes, e.created_at
                 FROM expenses e
                 INNER JOIN users u ON e.user_id = u.user_id
                 INNER JOIN expense_categories c ON e.category_id = c.category_id
                 WHERE e.team_id = ?`;
    const params = [team_id];

    if (month) {
      query += ` AND DATE_FORMAT(e.expense_date, '%Y-%m') = ?`;
      params.push(month);
    }

    if (category_id) {
      query += ` AND e.category_id = ?`;
      params.push(category_id);
    }

    query += ` ORDER BY e.expense_date DESC`;

    const [expenses] = await pool.query(query, params);

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

// 支出を更新
export const updateExpense = async (req, res) => {
  try {
    const { team_id, expense_id } = req.params;
    const { category_id, amount, expense_date, notes } = req.body;

    // バリデーション
    if (!category_id || !amount || !expense_date) {
      return res
        .status(400)
        .json({
          message: "Category ID, amount, and expense_date are required",
        });
    }

    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    // 支出が存在するかチェック
    const [expenses] = await pool.query(
      "SELECT expense_id FROM expenses WHERE expense_id = ? AND team_id = ?",
      [expense_id, team_id],
    );

    if (expenses.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // カテゴリーが存在するかチェック
    const [categories] = await pool.query(
      "SELECT category_id FROM expense_categories WHERE category_id = ? AND team_id = ?",
      [category_id, team_id],
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 支出を更新
    await pool.query(
      "UPDATE expenses SET category_id = ?, amount = ?, expense_date = ?, notes = ? WHERE expense_id = ? AND team_id = ?",
      [category_id, amount, expense_date, notes || null, expense_id, team_id],
    );

    res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Error updating expense" });
  }
};

// 支出を削除
export const deleteExpense = async (req, res) => {
  try {
    const { team_id, expense_id } = req.params;

    // 支出が存在するかチェック
    const [expenses] = await pool.query(
      "SELECT expense_id FROM expenses WHERE expense_id = ? AND team_id = ?",
      [expense_id, team_id],
    );

    if (expenses.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // 支出を削除
    await pool.query(
      "DELETE FROM expenses WHERE expense_id = ? AND team_id = ?",
      [expense_id, team_id],
    );

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};
