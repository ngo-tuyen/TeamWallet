import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header />

      <div className="flex">
        {/* サイドバー */}
        <Sidebar />

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}