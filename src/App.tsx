import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import ManageArticles from './pages/ManageArticles';
import ArticleDetail from './pages/ArticleDetail';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="articles">
            <Route path="create" element={<CreateArticle />} />
            <Route path="manage" element={<ManageArticles />} />
            <Route path=":id" element={<ArticleDetail />} />
            <Route path=":id/edit" element={<CreateArticle />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;