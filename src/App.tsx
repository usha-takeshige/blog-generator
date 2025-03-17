import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import ManageArticles from './pages/ManageArticles';
import ArticleDetail from './pages/ArticleDetail';
import SupabaseDemo from './pages/SupabaseDemo';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="articles">
              <Route path="create" element={<CreateArticle />} />
              <Route path="manage" element={<ManageArticles />} />
              <Route path=":id" element={<ArticleDetail />} />
              <Route path=":id/edit" element={<CreateArticle />} />
            </Route>
            <Route path="supabase-demo" element={<SupabaseDemo />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;