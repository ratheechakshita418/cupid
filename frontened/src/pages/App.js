import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ExplorePage from './pages/ExplorePage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 32 }}>💘</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const QuestionnaireGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.questionnaireCompleted) return <Navigate to="/questionnaire" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route
      path="/questionnaire"
      element={
        <PrivateRoute>
          <QuestionnairePage />
        </PrivateRoute>
      }
    />
    <Route
      path="/explore"
      element={
        <QuestionnaireGuard>
          <Layout><ExplorePage /></Layout>
        </QuestionnaireGuard>
      }
    />
    <Route
      path="/matches"
      element={
        <QuestionnaireGuard>
          <Layout><MatchesPage /></Layout>
        </QuestionnaireGuard>
      }
    />
    <Route
      path="/chat"
      element={
        <QuestionnaireGuard>
          <Layout><ChatPage /></Layout>
        </QuestionnaireGuard>
      }
    />
    <Route
      path="/chat/:userId"
      element={
        <QuestionnaireGuard>
          <Layout><ChatPage /></Layout>
        </QuestionnaireGuard>
      }
    />
    <Route
      path="/profile"
      element={
        <QuestionnaireGuard>
          <Layout><ProfilePage /></Layout>
        </QuestionnaireGuard>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
