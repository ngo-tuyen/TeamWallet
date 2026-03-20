import pool from "../config/database.js";

// チーム月間サマリーを取得
export const getTeamSummary = async (req, res) => {
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

    // 月が指定されていない場合は現在の月を使用
    let targetMonth = month;
    if (!targetMonth) {
      const now = new Date();
      targetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    // 総収入を計算
    const [incomeResult] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_income, COUNT(*) as income_count
       FROM incomes
       WHERE team_id = ? AND DATE_FORMAT(income_date, '%Y-%m') = ?`,
      [team_id, targetMonth],
    );

    // 総支出を計算
    const [expenseResult] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_expense, COUNT(*) as expense_count
       FROM expenses
       WHERE team_id = ? AND DATE_FORMAT(expense_date, '%Y-%m') = ?`,
      [team_id, targetMonth],
    );

    const totalIncome = parseFloat(incomeResult[0].total_income) || 0;
    const totalExpense = parseFloat(expenseResult[0].total_expense) || 0;
    const balance = totalIncome - totalExpense;

    res.status(200).json({
      team_id,
      month: targetMonth,
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: balance,
      income_count: incomeResult[0].income_count,
      expense_count: expenseResult[0].expense_count,
    });
  } catch (error) {
    console.error("Get team summary error:", error);
    res.status(500).json({ message: "Error fetching team summary" });
  }
};
