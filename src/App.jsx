import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Laboratory from './pages/Laboratory';
import Downloads from './pages/Downloads';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin Routes
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import useDynamicFavicon from './hooks/useDynamicFavicon';

function App() {
  useDynamicFavicon();
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sobre-nos" element={<About />} />
            <Route path="manutencao-e-automacao-industrial" element={<Services />} />
            <Route path="estrutura" element={<Laboratory />} />
            <Route path="download-de-manuais" element={<Downloads />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="entre-em-contato" element={<Contact />} />
          </Route>
          
          {/* Rotas Administrativas fora do Layout Padrão do Site */}
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Redirecionamentos de conveniência (Shortcuts) */}
          <Route path="/sobre" element={<Navigate to="/sobre-nos" replace />} />
          <Route path="/servicos" element={<Navigate to="/manutencao-e-automacao-industrial" replace />} />
          <Route path="/laboratorio" element={<Navigate to="/estrutura" replace />} />
          <Route path="/downloads" element={<Navigate to="/download-de-manuais" replace />} />
          <Route path="/contato" element={<Navigate to="/entre-em-contato" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
