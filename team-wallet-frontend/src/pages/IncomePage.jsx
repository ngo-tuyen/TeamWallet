import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getIncomes, createIncome, updateIncome, deleteIncome } from '../services/incomeService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function IncomePage() {
  const { teamId } = useParams();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ amount: '', incomeDate: '', notes: '' });

  useEffect(() => {
    const fetchIncomes = async () => {
      setLoading(true);
      try {
        const data = await getIncomes(teamId, month);
        setIncomes(data);
      } catch (err) {
        setError('Failed to load incomes');
      } finally {
        setLoading(false);
      }
    };
    fetchIncomes();
  }, [teamId, month]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.incomeDate) return;

    try {
      if (editingId) {
        await updateIncome(teamId, editingId, parseFloat(formData.amount), formData.incomeDate, formData.notes);
      } else {
        await createIncome(teamId, parseFloat(formData.amount), formData.incomeDate, formData.notes);
      }
      const data = await getIncomes(teamId, month);
      setIncomes(data);
      setFormData({ amount: '', incomeDate: '', notes: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Failed to save income');
    }
  };

  const handleDelete = async (incomeId) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await deleteIncome(teamId, incomeId);
        const data = await getIncomes(teamId, month);
        setIncomes(data);
      } catch (err) {
        setError('Failed to delete income');
      }
    }
  };

  const handleEdit = (income) => {
    setEditingId(income.income_id);
    setFormData({ amount: income.amount, incomeDate: income.income_date, notes: income.notes || '' });
    setShowForm(true);
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Income</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ amount: '', incomeDate: '', notes: '' });
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            {showForm ? 'Cancel' : 'Add Income'}
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit Income' : 'Add New Income'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Amount (¥)</label>
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
                <label className="block text-gray-700 font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={formData.incomeDate}
                  onChange={(e) => setFormData({ ...formData, incomeDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add notes about this income"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                {editingId ? 'Update Income' : 'Add Income'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading incomes..." />
        ) : incomes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No incomes for this month</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Notes</th>
                  <th className="px-6 py-3 text-left font-semibold">Recorded By</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {incomes.map((income) => (
                  <tr key={income.income_id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-800">{new Date(income.income_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 font-semibold text-green-600">¥{income.amount?.toLocaleString()}</td>
                    <td className="px-6 py-3 text-gray-600 text-sm">{income.notes || '-'}</td>
                    <td className="px-6 py-3 text-gray-600 text-sm">{income.full_name}</td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(income)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(income.income_id)}
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