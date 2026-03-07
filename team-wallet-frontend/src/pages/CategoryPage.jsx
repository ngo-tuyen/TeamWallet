import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getCategories, createCategory, deleteCategory } from '../services/categoryService.js';

export default function CategoryPage() {
  const { teamId } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);

  // カテゴリー一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(teamId);
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [teamId]);

  // カテゴリーを追加
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAdding(true);
    try {
      await createCategory(teamId, newCategoryName);
      const data = await getCategories(teamId);
      setCategories(data);
      setNewCategoryName('');
    } catch (err) {
      setError(err.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  // カテゴリーを削除
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(teamId, categoryId);
        const data = await getCategories(teamId);
        setCategories(data);
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense Categories</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* カテゴリー追加フォーム */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex space-x-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name (e.g., Food, Transport)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={adding}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        {/* カテゴリーリスト */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No categories yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.category_id}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">
                  {category.category_name}
                </span>
                <button
                  onClick={() => handleDeleteCategory(category.category_id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
