// Analytics tracking utility

// Track a page view
export const trackPageView = (path: string) => {
  try {
    // Get existing page visits
    const pageVisitsData = localStorage.getItem('analytics_page_visits');
    const pageVisits = pageVisitsData ? JSON.parse(pageVisitsData) : {};
    
    // Increment count for this path
    pageVisits[path] = (pageVisits[path] || 0) + 1;
    
    // Save back to localStorage
    localStorage.setItem('analytics_page_visits', JSON.stringify(pageVisits));
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track a unique session
export const trackSession = () => {
  try {
    // Check if we already have a session ID for today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const sessionKey = `analytics_session_${today}`;
    const sessionId = sessionStorage.getItem(sessionKey);
    
    // If no session ID for today, create one and increment daily count
    if (!sessionId) {
      // Generate a unique session ID
      const newSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(sessionKey, newSessionId);
      
      // Get existing session counts
      const sessionsData = localStorage.getItem('analytics_sessions');
      const sessions = sessionsData ? JSON.parse(sessionsData) : {};
      
      // Increment count for today
      sessions[today] = (sessions[today] || 0) + 1;
      
      // Save back to localStorage
      localStorage.setItem('analytics_sessions', JSON.stringify(sessions));
    }
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

// Initialize tracking on app load
export const initAnalytics = () => {
  // Track initial session
  trackSession();
  
  // Track initial page view
  trackPageView(window.location.pathname);
};

