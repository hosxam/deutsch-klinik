import { Outlet, Link, useLocation } from 'react-router-dom';
import { getState, updateState } from '../utils/store';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, GraduationCap, Home, BookOpen, ExternalLink, Stethoscope, ChevronRight } from 'lucide-react';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getState().theme);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateState({ theme: next });
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Home },
    ...levels.map(l => ({ to: `/level/${l}`, label: `Level ${l}`, icon: BookOpen })),
    { to: '/resources', label: 'Resources', icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--accent)' }}>
              <GraduationCap size={24} />
              <span className="hidden sm:inline">Deutsch Klinik C1</span>
              <span className="sm:hidden">DK C1</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: location.pathname === link.to ? 'var(--bg-hover)' : 'transparent',
                    color: location.pathname === link.to ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/medical"
                className="px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1"
                style={{
                  backgroundColor: getState().medicalUnlocked ? 'var(--bg-hover)' : 'transparent',
                  color: getState().medicalUnlocked ? '#3bff9e' : 'var(--text-muted)',
                }}
              >
                <Stethoscope size={14} /> Medical
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm"
                style={{
                  backgroundColor: location.pathname === link.to ? 'var(--bg-hover)' : 'transparent',
                  color: location.pathname === link.to ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <link.icon size={16} />
                {link.label}
                <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
