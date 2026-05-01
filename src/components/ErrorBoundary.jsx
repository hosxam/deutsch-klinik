import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error?.message || String(error) };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: '12px', padding: '2rem',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Something broke</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {this.state.error}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>
              Check the browser console (F12) for details.
            </p>
            <a href="/deutsch-klinik/"
               style={{
                 padding: '0.5rem 1.5rem', borderRadius: '8px', background: 'var(--accent)',
                 color: '#000', textDecoration: 'none', fontWeight: 600, display: 'inline-block'
               }}>
              Back to Dashboard
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
