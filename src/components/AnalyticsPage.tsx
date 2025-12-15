import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionData {
  date: string;
  count: number;
}

interface PageVisit {
  path: string;
  count: number;
}

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('analytics_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadAnalytics();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'potato420') {
      setIsAuthenticated(true);
      sessionStorage.setItem('analytics_authenticated', 'true');
      setPassword('');
      setError('');
      loadAnalytics();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const loadAnalytics = () => {
    // Load session data
    const sessionsData = localStorage.getItem('analytics_sessions');
    if (sessionsData) {
      const parsed = JSON.parse(sessionsData);
      // Convert to array and sort by date
      const sessionsArray: SessionData[] = Object.entries(parsed)
        .map(([date, count]) => ({ date, count: count as number }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSessions(sessionsArray);
    }

    // Load page visit data
    const pageVisitsData = localStorage.getItem('analytics_page_visits');
    if (pageVisitsData) {
      const parsed = JSON.parse(pageVisitsData);
      // Convert to array and sort by count (descending)
      const visitsArray: PageVisit[] = Object.entries(parsed)
        .map(([path, count]) => ({ path, count: count as number }))
        .sort((a, b) => b.count - a.count);
      setPageVisits(visitsArray);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('analytics_authenticated');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPageTitle = (path: string) => {
    if (path === '/') return 'Home';
    const pathMap: { [key: string]: string } = {
      '/food': 'Food',
      '/clothing': 'Clothing',
      '/electricity': 'Electricity Assistance',
      '/dental': 'Dental',
      '/beds': 'Beds',
      '/bedding': 'Bedding',
      '/furniture': 'Furniture',
      '/glasses': 'Glasses',
      '/whiteware': 'Whiteware',
      '/bond': 'Bond/Rent in Advance',
      '/rent-arrears': 'Rent Arrears',
      '/adsd': 'ADSD',
      '/car': 'Car Repairs',
      '/work': 'Transition to Work Grant',
      '/funeral': 'Assistance to Attend Funeral',
      '/stranded-travel': 'Stranded Travel',
      '/emergency': 'Other Emergency Payment',
      '/generic-template': 'Generic Template',
      '/tas-grant': 'TAS Grant',
      '/declare-income': 'Declare Income',
      '/absence-from-nz': 'Absence from NZ',
      '/change-of-address': 'Change of Address',
      '/petrol-calculator': 'Petrol Calculator',
      '/multi-need': 'Multi Need',
    };
    return pathMap[path] || path;
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="header">
          <div className="header-top">
            <div className="greeting-section">
              <h1 className="greeting">Analytics</h1>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <button className="copy-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>

        <div className="form-section-card section-visible" style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <div className="section-header">
            <h3>Password Required</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password"
                autoFocus
              />
              {error && (
                <div style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}
            </div>
            <button type="submit" className="copy-btn" style={{ width: '100%' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="greeting-section">
            <h1 className="greeting">Analytics</h1>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button className="copy-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <button className="copy-btn" onClick={handleLogout} style={{ background: '#6c757d' }}>
          Logout
        </button>
      </div>

      <div className="food-layout">
        {/* Unique Sessions per Day */}
        <div className="form-section-card section-visible">
          <div className="section-header">
            <h3>Unique Sessions per Day</h3>
          </div>
          {sessions.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {sessions.map((session, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '0.75rem 0',
                    borderBottom: index < sessions.length - 1 ? '1px solid var(--border-primary)' : 'none'
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {formatDate(session.date)}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {session.count} {session.count === 1 ? 'session' : 'sessions'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
              No session data available yet
            </div>
          )}
        </div>

        {/* Most Visited Pages */}
        <div className="form-section-card section-visible">
          <div className="section-header">
            <h3>Most Visited Pages</h3>
          </div>
          {pageVisits.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {pageVisits.map((visit, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '0.75rem 0',
                    borderBottom: index < pageVisits.length - 1 ? '1px solid var(--border-primary)' : 'none'
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {getPageTitle(visit.path)}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {visit.count} {visit.count === 1 ? 'visit' : 'visits'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
              No page visit data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

