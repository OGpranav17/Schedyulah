import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Home, BarChart3, Clock } from 'lucide-react';
import { TimerSession, TimerState } from '../types/timer';

const MotivationalQuotes: React.FC = () => {
  const quotes = [
    "Great job! Every minute of focus brings you closer to your goals. 🌟",
    "You're building amazing habits! Keep up the fantastic work! 💪",
    "Focus is your superpower. You just proved it! ✨",
    "Another productive session complete! You're unstoppable! 🚀",
    "Excellence is a habit, and you're mastering it! 🏆",
    "Your dedication is inspiring! Time well spent! 🌈",
    "Progress over perfection - and you're making great progress! 📈",
    "You turned time into achievement. That's pure magic! ⭐",
    "Consistency is key, and you're showing up! Amazing! 🔥",
    "Your future self is thanking you for this focused time! 💫"
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 300); // Half second for fade out, then fade in
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <p className={`text-lg text-gray-600 mb-8 italic transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      "{quotes[currentQuoteIndex]}"
    </p>
  );
};

interface TimerPageProps {
  activity: string;
  onAddSession: (session: TimerSession) => void;
  onNavigate: (page: 'home' | 'timer' | 'dashboard') => void;
}

const TimerPage: React.FC<TimerPageProps> = ({ activity, onAddSession, onNavigate }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    totalPausedTime: 0
  });

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [showEndSession, setShowEndSession] = useState(false);
  const [sessionStats, setSessionStats] = useState<{
    productivity: number;
    activeTime: number;
    totalTime: number;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseStartTime = useRef<number | null>(null);

  // Always update current time for total session calculation
  useEffect(() => {
    if (sessionStartTime) {
      totalTimeIntervalRef.current = setInterval(() => {
        setCurrentTime(Date.now());
      }, 100);
    }

    return () => {
      if (totalTimeIntervalRef.current) {
        clearInterval(totalTimeIntervalRef.current);
      }
    };
  }, [sessionStartTime]);

  useEffect(() => {
    if (timerState.isRunning && timerState.startTime) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime!
        }));
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.startTime]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    const now = Date.now();
    if (pauseStartTime.current) {
      // Resuming from pause
      const pauseDuration = now - pauseStartTime.current;
      setTimerState(prev => ({
        ...prev,
        isRunning: true,
        startTime: now - prev.elapsedTime,
        totalPausedTime: prev.totalPausedTime + pauseDuration
      }));
      pauseStartTime.current = null;
    } else {
      // Starting fresh
      const sessionStart = sessionStartTime || now;
      setTimerState({
        isRunning: true,
        startTime: now,
        elapsedTime: 0,
        totalPausedTime: 0
      });
      if (!sessionStartTime) {
        setSessionStartTime(sessionStart);
      }
      setCurrentTime(now);
    }
  };

  const handlePause = () => {
    pauseStartTime.current = Date.now();
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const handleEndSession = () => {
    if (!sessionStartTime) return;
    
    const now = Date.now();
    let finalPausedTime = timerState.totalPausedTime;
    
    if (pauseStartTime.current) {
      finalPausedTime += now - pauseStartTime.current;
    }

    const totalSessionTime = now - sessionStartTime;
    const productivity = totalSessionTime > 0 
      ? Math.round((timerState.elapsedTime / totalSessionTime) * 100)
      : 0;

    setSessionStats({
      productivity,
      activeTime: timerState.elapsedTime,
      totalTime: totalSessionTime
    });
    setShowEndSession(true);
  };

  const handleSaveSession = () => {
    if (!sessionStartTime || !sessionStats) return;
    
    const now = Date.now();
    let finalPausedTime = timerState.totalPausedTime;
    
    if (pauseStartTime.current) {
      finalPausedTime += now - pauseStartTime.current;
    }

    const session: TimerSession = {
      id: Date.now().toString(),
      activity,
      startTime: sessionStartTime,
      endTime: now,
      duration: timerState.elapsedTime,
      pausedTime: finalPausedTime,
      date: new Date(sessionStartTime).toLocaleDateString()
    };

    onAddSession(session);
    
    // Reset timer
    setTimerState({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      totalPausedTime: 0
    });
    pauseStartTime.current = null;
    setSessionStartTime(null);
    setCurrentTime(Date.now());
    setShowEndSession(false);
    setSessionStats(null);
    
    // Navigate to dashboard
    onNavigate('dashboard');
  };

  const totalSessionTime = sessionStartTime ? currentTime - sessionStartTime : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Schedyulah
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Timer Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          {!showEndSession ? (
            <>
              {/* Activity Title */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {activity}
                </h1>
                <p className="text-gray-600">Stay focused and track your progress</p>
              </div>

              {/* Timer Display */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8 sm:p-12 mb-8">
                <div className="text-6xl sm:text-7xl font-mono font-bold text-gray-900 mb-6 tracking-wider">
                  {formatTime(timerState.elapsedTime)}
                </div>
                
                {/* Timer Controls */}
                <div className="flex justify-center space-x-4">
                  {!timerState.isRunning ? (
                    <button
                      onClick={handleStart}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <Play className="w-8 h-8" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <Pause className="w-8 h-8" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
                  <div className="text-2xl font-bold text-pink-600 mb-1">
                    {formatTime(timerState.elapsedTime)}
                  </div>
                  <div className="text-sm text-gray-600">Active Time</div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {formatTime(totalSessionTime)}
                  </div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
              </div>

              {/* End Session Button */}
              {(timerState.elapsedTime > 0 || totalSessionTime > 0) && (
                <button
                  onClick={handleEndSession}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                >
                  END SESSION
                </button>
              )}

              {/* Status */}
              <div className="mt-8 flex justify-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  timerState.isRunning 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    timerState.isRunning ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {timerState.isRunning ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* End Session Summary */
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎉</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Session Complete!</h2>
                <MotivationalQuotes />
              </div>

              {sessionStats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-2">
                      {formatTime(sessionStats.activeTime)}
                    </div>
                    <div className="text-sm text-gray-600">Active Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {formatTime(sessionStats.totalTime)}
                    </div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-mint-600 mb-2">
                      {sessionStats.productivity}%
                    </div>
                    <div className="text-sm text-gray-600">Productivity</div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleSaveSession}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                >
                  Save & View Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowEndSession(false);
                    setSessionStats(null);
                  }}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                >
                  Continue Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerPage;