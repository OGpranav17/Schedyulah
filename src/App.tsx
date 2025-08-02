import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import TimerPage from './components/TimerPage';
import Dashboard from './components/Dashboard';
import { TimerSession } from './types/timer';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'timer' | 'dashboard'>('home');
  const [currentActivity, setCurrentActivity] = useState<string>('');
  const [sessions, setSessions] = useState<TimerSession[]>([]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('productivitySessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('productivitySessions', JSON.stringify(sessions));
  }, [sessions]);

  const startNewActivity = (activity: string) => {
    setCurrentActivity(activity);
    setCurrentPage('timer');
  };

  const addSession = (session: TimerSession) => {
    setSessions(prev => [...prev, session]);
  };

  const navigateTo = (page: 'home' | 'timer' | 'dashboard') => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-mint-50">
      {currentPage === 'home' && (
        <HomePage 
          onStartActivity={startNewActivity}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'timer' && (
        <TimerPage 
          activity={currentActivity}
          onAddSession={addSession}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          sessions={sessions}
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
}

export default App;