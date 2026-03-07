import pool from "../config/database.js";

// 収入を追加
export const createIncome = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { amount, income_date, notes } = req.body;
    const { user_id } = req.user;

    // バリデーション
    if (!amount || !income_date) {
      return res
        .status(400)
        .json({ message: "Amount and income_date are required" });
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

    // 収入を追加
    const [result] = await pool.query(
      "INSERT INTO incomes (team_id, user_id, amount, income_date, notes) VALUES (?, ?, ?, ?, ?)",
      [team_id, user_id, amount, income_date, notes || null],
    );

    res.status(201).json({
      message: "Income added successfully",
      income: {
        income_id: result.insertId,
        team_id,
        user_id,
        amount,
        income_date,
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error("Create income error:", error);
    res.status(500).json({ message: "Error creating income" });
  }
};

// 収入一覧を取得
export const getIncomes = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { month } = req.query;

    // チームが存在するかチェック
    const [teams] = await pool.query(
      "SELECT team_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 月でフィルタリング
    let query = `SELECT i.income_id, i.user_id, u.full_name, i.amount, i.income_date, i.notes, i.created_at
                 FROM incomes i
                 INNER JOIN users u ON i.user_id = u.user_id
                 WHERE i.team_id = ?`;
    const params = [team_id];

    if (month) {
      query += ` AND DATE_FORMAT(i.income_date, '%Y-%m') = ?`;
      params.push(month);
    }

    query += ` ORDER BY i.income_date DESC`;

    const [incomes] = await pool.query(query, params);

    res.status(200).json(incomes);
  } catch (error) {
    console.error("Get incomes error:", error);
    res.status(500).json({ message: "Error fetching incomes" });
  }
};

// 収入を更新
export const updateIncome = async (req, res) => {
  try {
    const { team_id, income_id } = req.params;
    const { amount, income_date, notes } = req.body;

    // バリデーション
    if (!amount || !income_date) {
      return res
        .status(400)
        .json({ message: "Amount and income_date are required" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    // 収入が存在するかチェック
    const [incomes] = await pool.query(
      "SELECT income_id FROM incomes WHERE income_id = ? AND team_id = ?",
      [income_id, team_id],
    );

    if (incomes.length === 0) {
      return res.status(404).json({ message: "Income not found" });
    }

    // 収入を更新
    await pool.query(
      "UPDATE incomes SET amount = ?, income_date = ?, notes = ? WHERE income_id = ? AND team_id = ?",
      [amount, income_date, notes || null, income_id, team_id],
    );

    res.status(200).json({ message: "Income updated successfully" });
  } catch (error) {
    console.error("Update income error:", error);
    res.status(500).json({ message: "Error updating income" });
  }
};

// 収入を削除
export const deleteIncome = async (req, res) => {
  try {
    const { team_id, income_id } = req.params;

    // 収入が存在するかチェック
    const [incomes] = await pool.query(
      "SELECT income_id FROM incomes WHERE income_id = ? AND team_id = ?",
      [income_id, team_id],
    );

    if (incomes.length === 0) {
      return res.status(404).json({ message: "Income not found" });
    }

    // 収入を削除
    await pool.query(
      "DELETE FROM incomes WHERE income_id = ? AND team_id = ?",
      [income_id, team_id],
    );

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Delete income error:", error);
    res.status(500).json({ message: "Error deleting income" });
  }
};
