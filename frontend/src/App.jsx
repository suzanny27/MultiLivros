import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Livros from './pages/Livros';
import Leitores from './pages/Leitores';
import Emprestimos from './pages/Emprestimos';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  BarChart2, 
  Sun, 
  Moon, 
  LogIn, 
  Compass, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

function MainApp() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Handle Mock Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Por favor, preencha a chave de acesso.');
      return;
    }
    // Simple mock authentication
    setIsAuthenticated(true);
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setActiveTab('dashboard');
  };

  // Render Page Content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard apiBaseUrl={API_BASE_URL} />;
      case 'livros':
        return <Livros apiBaseUrl={API_BASE_URL} />;
      case 'leitores':
        return <Leitores apiBaseUrl={API_BASE_URL} />;
      case 'emprestimos':
        return <Emprestimos apiBaseUrl={API_BASE_URL} />;
      default:
        return <Dashboard apiBaseUrl={API_BASE_URL} />;
    }
  };

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment dark:bg-tobacco paper-texture px-4 transition-colors duration-300">
        <div className="w-full max-w-md bg-emerald-victorian text-gold-old rounded-lg shadow-book-lg border-2 border-gold-old double-border-gold overflow-hidden relative leather-texture">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 border-t border-l border-gold-old/40 w-8 h-8"></div>
          <div className="absolute top-2 right-2 border-t border-r border-gold-old/40 w-8 h-8"></div>
          <div className="absolute bottom-2 left-2 border-b border-l border-gold-old/40 w-8 h-8"></div>
          <div className="absolute bottom-2 right-2 border-b border-r border-gold-old/40 w-8 h-8"></div>

          <div className="px-8 py-10 flex flex-col items-center">
            {/* Logo Emblem */}
            <div className="w-16 h-16 bg-gold-old/10 text-gold-old rounded-full flex items-center justify-center border-2 border-gold-old mb-4 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
              <Compass className="w-8 h-8 animate-pulse-slow" />
            </div>
            
            {/* System Title */}
            <h1 className="text-4xl font-bold font-serif tracking-wider text-center text-gold-light uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              MultiLivros
            </h1>
            <div className="w-24 border-b-2 border-double border-gold-old my-3"></div>
            <p className="text-xs italic text-stone-300 font-serif tracking-wide text-center max-w-xs mb-8">
              "Ex Libris — Entre para o Gabinete de Arquivos e Gestão Literária."
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} className="w-full space-y-5">
              {loginError && (
                <div className="p-3 bg-red-900/40 border border-red-500/30 text-red-200 text-xs rounded text-center font-serif">
                  {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gold-light font-serif">Administrador / E-mail</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: bibliotecario@multilivros.com"
                  className="w-full px-4 py-2.5 bg-black/30 border border-gold-old/40 rounded text-sm text-parchment focus:outline-none focus:border-gold-old placeholder-stone-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gold-light font-serif">Chave de Acesso</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-black/30 border border-gold-old/40 rounded text-sm text-parchment focus:outline-none focus:border-gold-old placeholder-stone-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gold-old hover:bg-gold-hover text-emerald-victorian font-bold text-sm tracking-wider uppercase rounded shadow-md border border-gold-old transition-all duration-300 mt-2 active:scale-[0.98]"
              >
                <LogIn className="w-4.5 h-4.5" />
                <span>Entrar no Gabinete</span>
              </button>
            </form>
          </div>
          
          {/* Footer branding */}
          <div className="bg-black/20 py-3 text-center border-t border-gold-old/20">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-sans">
              Biblioteca Digital MultiLivros v1.0.0
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN APP WORKSPACE
  return (
    <div className="min-h-screen flex bg-parchment dark:bg-tobacco text-coffee dark:text-parchment-dark paper-texture transition-colors duration-300">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-victorian text-gold-old border-r-2 border-vintage-gold relative leather-texture shrink-0">
        {/* Brand Banner */}
        <div className="p-6 border-b border-gold-old/20 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gold-old/10 text-gold-old rounded-full flex items-center justify-center border border-gold-old/40 mb-3 shadow-[0_0_10px_rgba(197,160,89,0.15)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-serif tracking-wider text-gold-light uppercase">
            MultiLivros
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-stone-300 font-serif">Biblioteca Geral</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gold-old text-emerald-victorian shadow-md'
                : 'text-stone-300 hover:bg-white/5 hover:text-gold-light'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span>Gabinete Geral</span>
          </button>
          
          <button
            onClick={() => setActiveTab('livros')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'livros'
                ? 'bg-gold-old text-emerald-victorian shadow-md'
                : 'text-stone-300 hover:bg-white/5 hover:text-gold-light'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Catálogo de Obras</span>
          </button>

          <button
            onClick={() => setActiveTab('leitores')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'leitores'
                ? 'bg-gold-old text-emerald-victorian shadow-md'
                : 'text-stone-300 hover:bg-white/5 hover:text-gold-light'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Fichário de Leitores</span>
          </button>

          <button
            onClick={() => setActiveTab('emprestimos')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'emprestimos'
                ? 'bg-gold-old text-emerald-victorian shadow-md'
                : 'text-stone-300 hover:bg-white/5 hover:text-gold-light'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Empréstimos</span>
          </button>
        </nav>

        {/* Sidebar Footer (Theme & Logout) */}
        <div className="p-4 border-t border-gold-old/20 space-y-2">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2 border border-gold-old/30 hover:border-gold-old rounded text-xs font-semibold tracking-wide text-stone-300 hover:text-gold-light transition-all"
          >
            <span className="font-serif italic">Modo do Gabinete</span>
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-gold-old" />
            ) : (
              <Sun className="w-4 h-4 text-gold-old" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-stone-400 hover:text-red-400 hover:bg-white/5 rounded transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Fechar Gabinete</span>
          </button>
        </div>
      </aside>

      {/* WORKSPACE CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER / NAVBAR */}
        <header className="bg-parchment-light dark:bg-tobacco-light border-b border-stone-200 dark:border-stone-800 shadow-sm px-6 py-4 flex items-center justify-between z-30 transition-colors">
          
          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-emerald-victorian dark:text-gold-light focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile branding */}
          <div className="lg:hidden flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-gold-old" />
            <h1 className="text-xl font-bold font-serif text-emerald-victorian dark:text-gold-light uppercase">
              MultiLivros
            </h1>
          </div>

          {/* Desktop Navbar Greeting / Date */}
          <div className="hidden lg:block">
            <p className="text-xs text-coffee-muted dark:text-stone-400 font-serif italic">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Quick Header actions */}
          <div className="flex items-center space-x-4">
            {/* Quick theme toggler for mobile & desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full text-coffee dark:text-parchment-dark transition-colors"
              title="Alternar Tema (Pergaminho / Tabaco)"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-gold-old" />}
            </button>

            {/* User Profile Emblem */}
            <div className="flex items-center space-x-2 border-l border-stone-200 dark:border-stone-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-emerald-victorian text-gold-old flex items-center justify-center font-bold text-xs shadow-inner">
                AD
              </div>
              <span className="hidden md:block text-xs font-semibold text-coffee dark:text-parchment-dark">
                Bibliotecário
              </span>
            </div>
          </div>
        </header>

        {/* MOBILE SIDEBAR PANEL (Drawer overlay) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
            <div className="w-64 bg-emerald-victorian text-gold-old flex flex-col relative leather-texture animate-slide-in">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-1 text-gold-old hover:text-gold-light"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 border-b border-gold-old/20 flex flex-col items-center text-center">
                <BookOpen className="w-10 h-10 text-gold-old mb-2" />
                <h2 className="text-xl font-bold font-serif text-gold-light uppercase">MultiLivros</h2>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold transition-all ${
                    activeTab === 'dashboard' ? 'bg-gold-old text-emerald-victorian' : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <BarChart2 className="w-5 h-5" />
                  <span>Gabinete Geral</span>
                </button>
                <button
                  onClick={() => { setActiveTab('livros'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold transition-all ${
                    activeTab === 'livros' ? 'bg-gold-old text-emerald-victorian' : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Catálogo de Obras</span>
                </button>
                <button
                  onClick={() => { setActiveTab('leitores'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold transition-all ${
                    activeTab === 'leitores' ? 'bg-gold-old text-emerald-victorian' : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Fichário de Leitores</span>
                </button>
                <button
                  onClick={() => { setActiveTab('emprestimos'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold transition-all ${
                    activeTab === 'emprestimos' ? 'bg-gold-old text-emerald-victorian' : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Empréstimos</span>
                </button>
              </nav>

              <div className="p-4 border-t border-gold-old/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 border border-red-500/30 text-red-400 text-xs font-semibold rounded hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Gabinete</span>
                </button>
              </div>
            </div>
            {/* Close area overlay */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* WORKSPACE PAGES AREA */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
