import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/expenseService.js';
import { getCategories } from '../services/categoryService.js';

export default function ExpensePage() {
  const { teamId } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // フォーム状態
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    expenseDate: '',
    notes: '',
  });

  // 支出とカテゴリーを取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const expensesData = await getExpenses(teamId, month);
        const categoriesData = await getCategories(teamId);
        setExpenses(expensesData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, month]);

  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount || !formData.expenseDate) return;

    try {
      if (editingId) {
        await updateExpense(
          teamId,
          editingId,
          parseInt(formData.categoryId),
          parseFloat(formData.amount),
          formData.expenseDate,
          formData.notes
        );
      } else {
        await createExpense(
          teamId,
          parseInt(formData.categoryId),
          parseFloat(formData.amount),
          formData.expenseDate,
          formData.notes
        );
      }

      const data = await getExpenses(teamId, month);
      setExpenses(data);
      setFormData({ categoryId: '', amount: '', expenseDate: '', notes: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    }
  };

  // 削除処理
  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(teamId, expenseId);
        const data = await getExpenses(teamId, month);
        setExpenses(data);
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  // 編集開始
  const handleEdit = (expense) => {
    setEditingId(expense.expense_id);
    setFormData({
      categoryId: expense.category_id,
      amount: expense.amount,
      expenseDate: expense.expense_date,
      notes: expense.notes || '',
    });
    setShowForm(true);
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ categoryId: '', amount: '', expenseDate: '', notes: '' });
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            {showForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* 月選択 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* フォーム */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount (¥)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add notes about this expense"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {editingId ? 'Update Expense' : 'Add Expense'}
              </button>
            </form>
          </div>
        )}

        {/* 支出一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No expenses for this month</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Notes</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Recorded By</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenses.map((expense) => (
                  <tr key={expense.expense_id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-800">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-gray-800 font-semibold">
                      {expense.category_name}
                    </td>
                    <td className="px-6 py-3 font-semibold text-red-600">
                      ¥{expense.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-gray-600 text-sm">
                      {expense.notes || '-'}
                    </td>
                    <td className="px-6 py-3 text-gray-600 text-sm">
                      {expense.full_name}
                    </td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.expense_id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
