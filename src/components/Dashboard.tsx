import React from 'react';
import { Home, Clock, BarChart3, Calendar, TrendingUp, Activity } from 'lucide-react';
import { TimerSession } from '../types/timer';

interface DashboardProps {
  sessions: TimerSession[];
  onNavigate: (page: 'home' | 'timer' | 'dashboard') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, onNavigate }) => {
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalActiveTime = sessions.reduce((total, session) => total + session.duration, 0);
  const totalSessionTime = sessions.reduce((total, session) => 
    total + (session.endTime - session.startTime), 0);
  
  const averageProductivity = sessions.length > 0 
    ? Math.round((totalActiveTime / totalSessionTime) * 100) 
    : 0;

  const todaySessions = sessions.filter(session => 
    session.date === new Date().toLocaleDateString()
  );

  const todayActiveTime = todaySessions.reduce((total, session) => total + session.duration, 0);

  // Group sessions by activity
  const activitiesMap = sessions.reduce((acc, session) => {
    if (!acc[session.activity]) {
      acc[session.activity] = {
        name: session.activity,
        totalTime: 0,
        sessions: 0
      };
    }
    acc[session.activity].totalTime += session.duration;
    acc[session.activity].sessions += 1;
    return acc;
  }, {} as Record<string, { name: string; totalTime: number; sessions: number }>);

  const topActivities = Object.values(activitiesMap)
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 5);

  // Recent sessions (last 10)
  const recentSessions = sessions
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-mint-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
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
            <div className="flex items-center space-x-2 text-pink-600">
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Productivity Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress and celebrate your achievements
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No sessions yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your first productivity session to see your beautiful analytics here.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Start Your First Session
            </button>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Active Time</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(totalActiveTime)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Today's Focus</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(todayActiveTime)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-mint-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-mint-400 to-emerald-400 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Productivity</p>
                    <p className="text-2xl font-bold text-gray-900">{averageProductivity}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-yellow-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Activities */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Top Activities</h2>
                <div className="space-y-4">
                  {topActivities.map((activity, index) => (
                    <div key={activity.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                          index === 0 ? 'bg-gradient-to-r from-pink-400 to-rose-400' :
                          index === 1 ? 'bg-gradient-to-r from-purple-400 to-indigo-400' :
                          index === 2 ? 'bg-gradient-to-r from-mint-400 to-emerald-400' :
                          'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.name}</p>
                          <p className="text-sm text-gray-600">{activity.sessions} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatTime(activity.totalTime)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{session.activity}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.startTime).toLocaleDateString()} at{' '}
                          {new Date(session.startTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatTime(session.duration)}</p>
                        <p className="text-sm text-gray-600">
                          {Math.round((session.duration / (session.endTime - session.startTime)) * 100)}% productive
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;