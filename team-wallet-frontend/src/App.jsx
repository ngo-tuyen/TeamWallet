import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { TeamProvider } from './context/TeamContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TeamFormPage from './pages/TeamFormPage.jsx';
import TeamDetailPage from './pages/TeamDetailPage.jsx';
import MemberPage from './pages/MemberPage.jsx';
import InvitationPage from './pages/InvitationPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import IncomePage from './pages/IncomePage.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import SummaryPage from './pages/SummaryPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import './index.css';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TeamProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/teams" element={<Navigate to="/dashboard" replace />} />
            <Route path="/invitations" element={<ProtectedRoute><InvitationPage /></ProtectedRoute>} />
            <Route path="/teams/create" element={<ProtectedRoute><TeamFormPage /></ProtectedRoute>} />
            <Route path="/teams/:teamId/edit" element={<ProtectedRoute><TeamFormPage /></ProtectedRoute>} />
            <Route path="/teams/:teamId" element={<ProtectedRoute><TeamDetailPage /></ProtectedRoute>} />
            <Route path="/teams/:teamId/members" element={<ProtectedRoute><MemberPage /></ProtectedRoute>} />
            <Route path="/teams/:teamId/categories" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
            <Route path="/teams/:teamId/income" element={<ProtectedRoute><IncomePage /></ProtectedRoute>} />
            <Route path="/teams/:teamId/expenses" element={<ProtectedRoute><ExpensePage /></ProtectedRoute>} />
            <Route path="/teams/:teamId/summary" element={<ProtectedRoute><SummaryPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </TeamProvider>
      </AuthProvider>
    </Router>
  );
}