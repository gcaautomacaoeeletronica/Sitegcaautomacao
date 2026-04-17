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
import IoT from './pages/IoT';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Admin Routes
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import useDynamicFavicon from './hooks/useDynamicFavicon';

// Firebase Sync Initialization
import { useEffect } from 'react';
import { useAdminStore } from './store/adminStore';
import { MARCAS_DEFAULT, BLOG_POSTS_DEFAULT, SITE_CONTENT_DEFAULT, SITE_MEDIA_DEFAULT } from './data/initialData';

function App() {
  useDynamicFavicon();
  const init = useAdminStore(state => state.init);
  const seedSupabase = useAdminStore(state => state.seedSupabase);

  useEffect(() => {
    // 1. Inicia os Listeners de tempo real
    init();

    // 2. Tenta fazer o seed se o banco estiver vazio
    seedSupabase({
      marcas: MARCAS_DEFAULT,
      blogPosts: BLOG_POSTS_DEFAULT,
      siteContent: SITE_CONTENT_DEFAULT,
      siteMedia: SITE_MEDIA_DEFAULT
    });
  }, [init, seedSupabase]);

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
            <Route path="iot" element={<IoT />} />
            <Route path="privacidade" element={<Privacy />} />
            <Route path="termos" element={<Terms />} />
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
          <Route path="/iotconects" element={<Navigate to="/iot" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
