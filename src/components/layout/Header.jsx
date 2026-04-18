import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import EditableText from '../ui/EditableText';

const Header = () => {
  const global = useAdminStore((state) => state.siteContent.global);
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Fecha o menu de mobile quando a rota muda
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Aplica o glassmorphism caso tenhamos scrollado para baixo
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'Sobre Nós', path: '/sobre-nos' },
    { name: 'SERVIÇOS', path: '/manutencao-e-automacao-industrial' },
    { name: 'Laboratório', path: '/estrutura' },
    { name: 'DOWNLOAD', path: '/download-de-manuais' },
    { name: 'BLOG', path: '/blog' },
    { name: 'IOT', path: '/iot', badge: 'NEW' },
    { name: 'CONTATO', path: '/entre-em-contato' },
  ];

  return (
    <header className={`fixed w-full top-0 z-[100] transition-all duration-300 ${scrolled ? 'translate-y-[-40px]' : ''}`}>
      {/* Top Bar Ultra Rápida e Fina */}
      <div className="bg-primary-dark text-gray-300 text-xs py-1.5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 tracking-wider">
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
               <Phone size={12} className="text-accent" />
               <EditableText pagina="global" path="phone" tag="span">{global?.phone || ''}</EditableText>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
               <Mail size={12} className="text-accent" />
               <EditableText pagina="global" path="email" tag="span">{global?.email || ''}</EditableText>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Corporativa e Sólida */}
      <div className={`transition-all duration-300 ease-in-out bg-white border-b border-gray-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          <div className="flex justify-between items-center h-full">
            {/* Logo com Glow Sutil no hover */}
            <div className="flex-shrink-0 flex items-center group cursor-pointer">
              <div className="relative flex items-center gap-3">
                 {siteMedia.logo?.url && (
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-primary/10 group-hover:border-primary/30 transition-all bg-white flex items-center justify-center p-1 shrink-0 shadow-sm">
                     <img src={siteMedia.logo.url} alt="Logo GCA" className="w-full h-full object-contain" />
                   </div>
                 )}
                 <span className="font-extrabold text-lg md:text-xl xl:text-2xl text-primary tracking-tight uppercase">
                   <EditableText pagina="global" path="logoText" tag="span">GCA Automação</EditableText>
                 </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 h-full items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-xs lg:text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-300 relative group flex items-center h-full opacity-90 hover:opacity-100 ${
                      isActive ? 'text-accent' : 'text-gray-600 hover:text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {link.badge && (
                        <span className="ml-1.5 text-[8px] font-black bg-cyan-500 text-white px-1.5 py-0.5 rounded-full tracking-widest">{link.badge}</span>
                      )}
                      <span className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ease-out bg-primary ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-accent focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden absolute w-full transition-all duration-300 origin-top overflow-hidden ${
        isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
      }`}>
        <div className="bg-white shadow-xl border-t border-gray-100 pb-2">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-3 border-b border-gray-50 text-sm font-bold tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-blue-50/50 text-primary border-l-4 border-l-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3">
                     {link.name}
                     {link.badge && (
                       <span className="ml-auto text-[8px] font-black bg-cyan-500 text-white px-2 py-1 rounded-md tracking-widest">{link.badge}</span>
                     )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
