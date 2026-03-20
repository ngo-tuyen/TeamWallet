import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getTeamSummary } from '../services/teamService.js';

export default function SummaryPage() {
  const { teamId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await getTeamSummary(teamId, month);
        setSummary(data);
      } catch (err) {
        setError('Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [teamId, month]);

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Monthly Summary</h1>

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

        {loading ? (
          <LoadingSpinner message="Loading summary..." />
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income Card */}
            <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm mb-2">TOTAL INCOME</p>
              <p className="text-4xl font-bold text-green-600">¥{summary.total_income?.toLocaleString() || 0}</p>
              <p className="text-gray-500 text-sm mt-4">
                {summary.income_count} {summary.income_count === 1 ? 'record' : 'records'}
              </p>
            </div>

            {/* Expense Card */}
            <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm mb-2">TOTAL EXPENSES</p>
              <p className="text-4xl font-bold text-red-600">¥{summary.total_expense?.toLocaleString() || 0}</p>
              <p className="text-gray-500 text-sm mt-4">
                {summary.expense_count} {summary.expense_count === 1 ? 'record' : 'records'}
              </p>
            </div>

            {/* Balance Card */}
            <div className={`rounded-lg shadow p-6 border-l-4 ${summary.balance >= 0 ? 'bg-blue-50 border-blue-500' : 'bg-orange-50 border-orange-500'}`}>
              <p className="text-gray-600 text-sm mb-2">BALANCE</p>
              <p className={`text-4xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                ¥{summary.balance?.toLocaleString() || 0}
              </p>
              <p className="text-gray-500 text-sm mt-4">Income - Expenses</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No data available for this month</p>
          </div>
        )}

        {/* Summary Details */}
        {summary && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-green-500">
                  Income Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Income:</span>
                    <span className="font-semibold text-green-600">¥{summary.total_income?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Number of Records:</span>
                    <span>{summary.income_count || 0}</span>
                  </div>
                  {summary.income_count > 0 && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Average per Record:</span>
                      <span>¥{(summary.total_income / summary.income_count).toLocaleString('ja-JP', {maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-red-500">
                  Expense Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Expenses:</span>
                    <span className="font-semibold text-red-600">¥{summary.total_expense?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Number of Records:</span>
                    <span>{summary.expense_count || 0}</span>
                  </div>
                  {summary.expense_count > 0 && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Average per Record:</span>
                      <span>¥{(summary.total_expense / summary.expense_count).toLocaleString('ja-JP', {maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="mt-6 pt-6 border-t-2">
              <div className={`p-4 rounded-lg ${summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <p className="text-gray-600 text-sm mb-1">NET BALANCE</p>
                <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ¥{summary.balance?.toLocaleString() || 0}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {summary.balance >= 0 
                    ? '✓ More income than expenses'
                    : '⚠ More expenses than income'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}