import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentProfileName, getState, signOutProfile, updateState } from '../utils/store';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, GraduationCap, Home, ExternalLink, Stethoscope, ChevronRight, ClipboardCheck, AlertTriangle, Dumbbell, Settings } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getState().theme);
  const profileName = getCurrentProfileName();
  const location = useLocation();
  const navigate = useNavigate();

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
    { to: '/practice', label: 'Practice', icon: Dumbbell },
    { to: '/mistake-notebook', label: 'Review', icon: AlertTriangle },
    { to: '/medical-fsp', label: 'FSP', icon: Stethoscope },
    { to: '/resources', label: 'Resources', icon: ExternalLink },
  ];
  const extraNavLinks = [
    { to: '/medical', label: 'Medical', icon: Stethoscope, accent: getState().medicalUnlocked ? '#3bff9e' : 'var(--text-muted)' },
    { to: '/c1-readiness', label: 'C1 Ready', icon: ClipboardCheck, accent: 'var(--accent)' },
    { to: '/', label: 'Settings / Goal', icon: Settings, accent: 'var(--accent)' },
  ];
  const activeLevel = levels.find(l => location.pathname.startsWith(`/level/${l}`)) || getState().currentLevel || 'A1';
  const profileLabel = profileName === 'hossam' ? 'Hossam' : 'Your Wife';
  const profileIcon = profileName === 'hossam' ? '🩺' : '🌸';

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
              <select
                aria-label="Select level"
                value={activeLevel}
                onChange={(e) => { const val = e.target.value; if (['A1','A2','B1','B2','C1'].includes(val)) { navigate(`/level/${val}`); } }}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {levels.map(l => <option key={l} value={l}>Level {l}</option>)}
              </select>
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
              <Link
                to="/c1-readiness"
                className="px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1"
                style={{
                  backgroundColor: location.pathname === '/c1-readiness' ? 'var(--bg-hover)' : 'transparent',
                  color: location.pathname === '/c1-readiness' ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <ClipboardCheck size={14} /> C1 Ready
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
              >
                <span aria-hidden="true">{profileIcon}</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {profileLabel}
                </span>
                <button
                  type="button"
                  onClick={signOutProfile}
                  className="text-xs font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  Switch
                </button>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
                className="md:hidden p-2 rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
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
            <label className="block px-3 pt-3 pb-1 text-xs" style={{ color: 'var(--text-muted)' }}>Level</label>
            <select
              aria-label="Select level"
              value={activeLevel}
              onChange={(e) => { const val = e.target.value; if (['A1','A2','B1','B2','C1'].includes(val)) { navigate(`/level/${val}`); } setMenuOpen(false); }}
              className="w-full mb-2 px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              {levels.map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
            {extraNavLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm"
                style={{
                  backgroundColor: location.pathname === link.to ? 'var(--bg-hover)' : 'transparent',
                  color: location.pathname === link.to ? link.accent : 'var(--text-secondary)',
                }}
              >
                <link.icon size={16} />
                {link.label}
                <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
              </Link>
            ))}
            <button
              type="button"
              onClick={signOutProfile}
              className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-sm"
              style={{ color: 'var(--accent)', backgroundColor: 'var(--bg-hover)' }}
            >
              <span aria-hidden="true">{profileIcon}</span>
              Switch from {profileLabel}
            </button>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
