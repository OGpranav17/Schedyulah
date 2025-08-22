import React, { useState } from 'react';
import { Play, Clock, TrendingUp, Users, Star, Mail, Phone } from 'lucide-react';

interface HomePageProps {
  onStartActivity: (activity: string) => void;
  onNavigate: (page: 'home' | 'timer' | 'dashboard') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartActivity, onNavigate }) => {
  const [activityInput, setActivityInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleStartActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (activityInput.trim()) {
      onStartActivity(activityInput.trim());
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-rose-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-wine-800 via-burgundy-600 to-rose-500 bg-clip-text text-transparent tracking-wide transform transition-all duration-300 hover:scale-110 cursor-pointer" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                Schedyulah
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-wine-700 transition-colors">Features</a>
              <a href="#contact" className="text-gray-700 hover:text-wine-700 transition-colors">Contact</a>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-gradient-to-r from-wine-700 to-burgundy-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-rose-200 via-pink-100 to-white bg-clip-text text-transparent">
              Transform Your Productivity
            </span>
          </h1>
          <p className="text-xl text-rose-50 mb-12 max-w-2xl mx-auto leading-relaxed">
            Track your productive activities with beautiful simplicity. Perfect for students, creatives, 
            and anyone who values their time.
          </p>
          
          <form onSubmit={handleStartActivity} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                placeholder="What are you working on today?"
                className="w-full px-6 py-4 text-lg border-2 border-rose-300 rounded-full focus:outline-none focus:border-wine-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-gradient-to-r from-wine-700 to-burgundy-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-200 rounded-full"></div>
              <span className="text-rose-100">Start tracking instantly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-200 rounded-full"></div>
              <span className="text-rose-100">No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-rose-100">Beautiful analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 sm:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay focused
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, beautiful tools designed to help you track and improve your productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/90 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-rose-200">
              <div className="w-12 h-12 bg-gradient-to-r from-wine-600 to-burgundy-500 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Timer</h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitive timer with start, pause, and stop functionality. Track your focus sessions with precision.
              </p>
            </div>

            <div className="bg-white/90 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-rose-200">
              <div className="w-12 h-12 bg-gradient-to-r from-burgundy-600 to-rose-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful charts and insights to understand your productivity patterns and improve over time.
              </p>
            </div>

            <div className="bg-white/90 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-rose-200">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-rose-400 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Activity Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize your time by different activities. Perfect for students, professionals, and creatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 sm:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-wine-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-wine-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-wine-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-wine-700 to-burgundy-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-wine-600 to-burgundy-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">hello@schedyulah.app</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-burgundy-600 to-rose-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-300 via-burgundy-300 to-wine-300 bg-clip-text text-transparent tracking-wide transform transition-all duration-300 hover:scale-110 cursor-pointer" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                Schedyulah
              </span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-rose-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-rose-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-rose-400 transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2025 Schedyulah. Made with ❤️ for productive people.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;