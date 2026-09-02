import React, { useState, useEffect, useRef } from 'react';
import { recordInputActivity } from '../utils/recentInputActivity';

interface CalendarProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange, placeholder = "Select date", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        const date = new Date(year, month, day);
        setSelectedDate(date);
        setCurrentDate(date);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return day === 0 ? 6 : day - 1;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (date: Date) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(newDate);
    setCurrentDate(newDate);
    onChange(formatDate(newDate));
    recordInputActivity();
    setIsOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const renderDayCell = (date: Date, outsideMonth: boolean) => {
    const isSelected = selectedDate ? isSameDay(selectedDate, date) : false;
    const isToday = isSameDay(new Date(), date);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    return (
      <div
        key={key}
        className={`calendar-day${outsideMonth ? ' outside-month' : ''}${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}`}
        onClick={() => handleDateSelect(date)}
      >
        {date.getDate()}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days: React.ReactNode[] = [];

    const daysInPrevMonth = getDaysInMonth(new Date(year, month - 1, 1));
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(renderDayCell(new Date(year, month - 1, daysInPrevMonth - i), true));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderDayCell(new Date(year, month, day), false));
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      days.push(renderDayCell(new Date(year, month + 1, day), true));
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`calendar-container ${isOpen ? 'calendar-open' : ''} ${className}`} ref={calendarRef}>
      <input
        type="text"
        className="form-control calendar-input"
        value={value || ''}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
      />
      
      <div className={`calendar-dropdown ${isOpen ? 'calendar-dropdown-open' : ''}`}>
        <div className="calendar-header">
          <button
            className="calendar-nav-btn"
            onClick={() => handleYearChange('prev')}
            title="Previous year"
          >
            ‹‹
          </button>
          <button
            className="calendar-nav-btn"
            onClick={() => handleMonthChange('prev')}
            title="Previous month"
          >
            ‹
          </button>
          <div className="calendar-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button
            className="calendar-nav-btn"
            onClick={() => handleMonthChange('next')}
            title="Next month"
          >
            ›
          </button>
          <button
            className="calendar-nav-btn"
            onClick={() => handleYearChange('next')}
            title="Next year"
          >
            ››
          </button>
        </div>
        
        <div className="calendar-weekdays">
          <div className="calendar-weekday">Mon</div>
          <div className="calendar-weekday">Tue</div>
          <div className="calendar-weekday">Wed</div>
          <div className="calendar-weekday">Thu</div>
          <div className="calendar-weekday">Fri</div>
          <div className="calendar-weekday">Sat</div>
          <div className="calendar-weekday">Sun</div>
        </div>
        
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
