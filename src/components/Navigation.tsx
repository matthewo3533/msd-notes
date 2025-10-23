import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Settings from './Settings';

interface NavigationProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  customHeadingFormat: any;
  onCustomHeadingFormatChange: (format: any) => void;
}

interface NavItem {
  id: string;
  title: string;
  path: string;
  emoji: string;
  category: 'home' | 'hardships' | 'tools';
}

const navigationItems: NavItem[] = [
  // Home
  { id: 'home', title: 'Home', path: '/', emoji: '🏠', category: 'home' },
  
  // Hardships
  { id: 'food', title: 'Food', path: '/food', emoji: '🍽️', category: 'hardships' },
  { id: 'clothing', title: 'Clothing', path: '/clothing', emoji: '👕', category: 'hardships' },
  { id: 'electricity', title: 'Electricity Assistance', path: '/electricity', emoji: '⚡', category: 'hardships' },
  { id: 'dental', title: 'Dental', path: '/dental', emoji: '🦷', category: 'hardships' },
  { id: 'beds', title: 'Beds', path: '/beds', emoji: '🛏️', category: 'hardships' },
  { id: 'bedding', title: 'Bedding', path: '/bedding', emoji: '🛌', category: 'hardships' },
  { id: 'furniture', title: 'Furniture', path: '/furniture', emoji: '🛋️', category: 'hardships' },
  { id: 'glasses', title: 'Glasses', path: '/glasses', emoji: '👓', category: 'hardships' },
  { id: 'fridge', title: 'Fridge', path: '/fridge', emoji: '❄️', category: 'hardships' },
  { id: 'washing', title: 'Washing Machine', path: '/washing', emoji: '🫧', category: 'hardships' },
  { id: 'bond', title: 'Bond/Rent in Advance', path: '/bond', emoji: '🏠', category: 'hardships' },
  { id: 'rent-arrears', title: 'Rent Arrears', path: '/rent-arrears', emoji: '💰', category: 'hardships' },
  { id: 'adsd', title: 'ADSD', path: '/adsd', emoji: '💵', category: 'hardships' },
  { id: 'car', title: 'Car repairs', path: '/car', emoji: '🚗', category: 'hardships' },
  { id: 'work', title: 'Transition to Work Grant', path: '/work', emoji: '💼', category: 'hardships' },
  { id: 'funeral', title: 'Assistance to Attend Funeral', path: '/funeral', emoji: '⚰️', category: 'hardships' },
  { id: 'stranded-travel', title: 'Stranded Travel', path: '/stranded-travel', emoji: '⛽', category: 'hardships' },
  { id: 'emergency', title: 'Other Emergency Payment', path: '/emergency', emoji: '🚨', category: 'hardships' },
  
  // Tools
  { id: 'tas-grant', title: 'TAS Grant', path: '/tas-grant', emoji: '📋', category: 'tools' },
  { id: 'declare-income', title: 'Declare Income', path: '/declare-income', emoji: '💰', category: 'tools' },
  { id: 'absence-from-nz', title: 'Absence from NZ', path: '/absence-from-nz', emoji: '✈️', category: 'tools' },
  { id: 'petrol-calculator', title: 'Petrol Calculator', path: '/petrol-calculator', emoji: '⛽', category: 'tools' },
];

const Navigation: React.FC<NavigationProps> = ({ currentTheme, onThemeChange, customHeadingFormat, onCustomHeadingFormatChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hardshipsSearch, setHardshipsSearch] = useState('');
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timeoutRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const globalSearchRef = useRef<HTMLInputElement | null>(null);

  // Handle ESC key to open global search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isGlobalSearchOpen) {
          // Close global search if open
          setIsGlobalSearchOpen(false);
          setGlobalSearchQuery('');
        } else {
          // Open global search if closed
          setIsGlobalSearchOpen(true);
          setGlobalSearchQuery('');
          // Focus search input after a short delay
          setTimeout(() => {
            globalSearchRef.current?.focus();
          }, 50);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen]);

  // Focus search input when hardships dropdown opens
  useEffect(() => {
    if (activeDropdown === 'hardships' && searchInputRef.current) {
      // Small delay to ensure dropdown is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [activeDropdown]);

  // Prevent scrolling when dropdown is open
  useEffect(() => {
    if (activeDropdown === 'hardships' || activeDropdown === 'tools' || isGlobalSearchOpen) {
      document.body.classList.add('dropdown-active');
    } else {
      document.body.classList.remove('dropdown-active');
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.classList.remove('dropdown-active');
    };
  }, [activeDropdown, isGlobalSearchOpen]);

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle tab visibility change to fix blur bug when switching tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      // If the page becomes hidden (user switches tabs) and we have an active dropdown,
      // clean up to prevent it from staying stuck
      if (document.hidden && activeDropdown) {
        setActiveDropdown(null);
        setIsNavHovered(false);
        // Clear any pending timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown]) {
        const dropdown = dropdownRefs.current[activeDropdown];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setActiveDropdown(null);
          // Clear nav hover state
          setIsNavHovered(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
    setIsNavHovered(true);
  };

  const handleMouseLeave = () => {
    // Don't close dropdown if search is focused
    if (activeDropdown === 'hardships' && document.activeElement?.classList.contains('search-input')) {
      return;
    }
    
    setIsNavHovered(false);
    
    // Close dropdown after a short delay if not hovering nav
    timeoutRef.current = setTimeout(() => {
      if (!isNavHovered) {
        setActiveDropdown(null);
      }
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    // Cancel timeout if mouse re-enters dropdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsNavHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    // Don't close dropdown if search is focused
    if (activeDropdown === 'hardships' && document.activeElement?.classList.contains('search-input')) {
      return;
    }
    
    setIsNavHovered(false);
    
    // Close dropdown after a short delay if not hovering nav
    timeoutRef.current = setTimeout(() => {
      if (!isNavHovered) {
        setActiveDropdown(null);
      }
    }, 100);
  };

  const handleNavItemClick = (path: string) => {
    navigate(path);
    setActiveDropdown(null);
  };

  const getGlobalSearchHint = () => {
    const filteredItems = getGlobalSearchResults();
    if (globalSearchQuery.trim() && filteredItems.length === 1) {
      return `Press Enter to go to ${filteredItems[0].title}`;
    }
    return '';
  };

  const getGlobalSearchResults = () => {
    if (!globalSearchQuery.trim()) return navigationItems;
    
    return navigationItems.filter(item => 
      item.title.toLowerCase().includes(globalSearchQuery.toLowerCase())
    );
  };

  const handleGlobalSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const filteredItems = getGlobalSearchResults();
      if (filteredItems.length === 1) {
        handleNavItemClick(filteredItems[0].path);
        setIsGlobalSearchOpen(false);
        setGlobalSearchQuery('');
      }
    }
  };

  const handleGlobalSearchClose = () => {
    setIsGlobalSearchOpen(false);
    setGlobalSearchQuery('');
  };

  const handleSearchIconClick = () => {
    setIsGlobalSearchOpen(true);
    setGlobalSearchQuery('');
    setTimeout(() => {
      globalSearchRef.current?.focus();
    }, 50);
  };

  const getCategoryItems = (category: string) => {
    return navigationItems.filter(item => item.category === category);
  };

    const getFilteredHardships = () => {
    const hardships = getCategoryItems('hardships');
    if (!hardshipsSearch.trim()) return hardships;
    
    return hardships.filter(item => 
      item.title.toLowerCase().includes(hardshipsSearch.toLowerCase())
    );
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const filteredItems = getFilteredHardships();
      if (filteredItems.length === 1) {
        handleNavItemClick(filteredItems[0].path);
        setHardshipsSearch('');
      }
    }
  };

  const handleSearchFocus = () => {
    // Ensure dropdown stays open when search is focused
    if (activeDropdown !== 'hardships') {
      setActiveDropdown('hardships');
    }
  };

  const handleSearchBlur = () => {
    // Close dropdown when search loses focus
    setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const getSearchHint = () => {
    const filteredItems = getFilteredHardships();
    if (hardshipsSearch.trim() && filteredItems.length === 1) {
      return `Press Enter to go to ${filteredItems[0].title}`;
    }
    return '';
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Handle horizontal scrolling with vertical scroll wheel
  const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget;
    const scrollAmount = event.deltaY * 1.5; // Smoother scroll speed
    const currentScroll = target.scrollLeft;
    const maxScroll = target.scrollWidth - target.clientWidth;
    
    // Smooth scrolling with easing
    const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + scrollAmount));
    
    // Use smooth scrolling if available
    if ('scrollBehavior' in target.style) {
      target.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    } else {
      target.scrollLeft = newScroll;
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div 
        className="nav-container"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => {
          setIsNavHovered(false);
          // Close dropdown after a short delay if not hovering nav
          timeoutRef.current = setTimeout(() => {
            if (!isNavHovered) {
              setActiveDropdown(null);
            }
          }, 100);
        }}
      >
        <div className="nav-brand">
          <button 
            className="brand-text brand-button"
            onClick={() => handleNavItemClick('/')}
          >
            MSD Note Grid
          </button>
        </div>

        <div className="nav-menu">
          {/* Home */}
          <div 
            className={`nav-item ${activeDropdown === 'home' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('home')}
            onMouseLeave={() => handleMouseLeave()}
          >
            <button 
              className={`nav-button ${isActiveRoute('/') ? 'current' : ''}`}
              onClick={() => handleNavItemClick('/')}
            >
              <span className="nav-text">Home</span>
            </button>
          </div>

          {/* Hardships */}
          <div 
            className={`nav-item ${activeDropdown === 'hardships' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('hardships')}
            onMouseLeave={() => handleMouseLeave()}
            ref={el => dropdownRefs.current['hardships'] = el}
          >
            <button className="nav-button">
              <span className="nav-text">Hardships</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {activeDropdown === 'hardships' && (
              <div 
                className="dropdown-menu hardships-dropdown"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                onWheel={(e) => e.preventDefault()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="dropdown-header">
                  <div className="dropdown-title-row">
                    <span className="dropdown-title">Hardship Assistance</span>
                    <input
                      type="text"
                      placeholder="Search hardships..."
                      value={hardshipsSearch}
                      onChange={(e) => setHardshipsSearch(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="search-input"
                      ref={searchInputRef}
                    />
                    {getSearchHint() && (
                      <span className="search-hint">{getSearchHint()}</span>
                    )}
                  </div>
                </div>
                <div className="dropdown-items" onWheel={handleWheelScroll}>
                  {getFilteredHardships().map((item) => (
                    <button
                      key={item.id}
                      className={`dropdown-item ${isActiveRoute(item.path) ? 'current' : ''}`}
                      onClick={() => handleNavItemClick(item.path)}
                    >
                      <span className="item-emoji">{item.emoji}</span>
                      <span className="item-title">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tools */}
          <div 
            className={`nav-item ${activeDropdown === 'tools' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('tools')}
            onMouseLeave={() => handleMouseLeave()}
            ref={el => dropdownRefs.current['tools'] = el}
          >
            <button className="nav-button">
              <span className="nav-text">Tools</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {activeDropdown === 'tools' && (
              <div 
                className="dropdown-menu tools-dropdown"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="dropdown-header">
                  <span className="dropdown-title">Tools & Utilities</span>
                  <span className="dropdown-subtitle">Helpful calculators and forms</span>
                </div>
                <div className="dropdown-items" onWheel={handleWheelScroll}>
                  {getCategoryItems('tools').map((item) => (
                    <button
                      key={item.id}
                      className={`dropdown-item ${isActiveRoute(item.path) ? 'current' : ''}`}
                      onClick={() => handleNavItemClick(item.path)}
                    >
                      <span className="item-emoji">{item.emoji}</span>
                      <span className="item-title">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="nav-actions">
          <div className="nav-search-container">
            <button 
              className="nav-search-icon"
              onClick={handleSearchIconClick}
              title="Search all pages (ESC)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            {isGlobalSearchOpen && (
              <div className="global-search-dropdown">
                <div className="global-search-container">
                  <div className="global-search-header">
                    <h3>Search All Pages</h3>
                    <button 
                      className="global-search-close"
                      onClick={handleGlobalSearchClose}
                      title="Close (ESC)"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    onKeyDown={handleGlobalSearchKeyDown}
                    className="global-search-input"
                    ref={globalSearchRef}
                  />
                  {getGlobalSearchHint() && (
                    <div className="global-search-hint">{getGlobalSearchHint()}</div>
                  )}
                  <div className="global-search-results">
                    {getGlobalSearchResults().map((item) => (
                      <button
                        key={item.id}
                        className="global-search-item"
                        onClick={() => {
                          handleNavItemClick(item.path);
                          setIsGlobalSearchOpen(false);
                          setGlobalSearchQuery('');
                        }}
                      >
                        <span className="global-search-emoji">{item.emoji}</span>
                        <span className="global-search-title">{item.title}</span>
                        <span className="global-search-category">{item.category}</span>
                      </button>
                    ))}
                  </div>
                  <button 
                    className="mobile-search-close"
                    onClick={handleGlobalSearchClose}
                    title="Close Search"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
          <Settings 
            currentTheme={currentTheme} 
            onThemeChange={onThemeChange} 
            customHeadingFormat={customHeadingFormat}
            onCustomHeadingFormatChange={onCustomHeadingFormatChange}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
