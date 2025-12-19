import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Added Link

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">SkillSync</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-600 mb-8">
              Welcome to your SkillSync dashboard! Your learning journey starts here.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Skills Learning
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Skills Completed
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Study Streak
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0 days
                  </dd>
                </div>
              </div>
            </div>

            {/* Quick Actions / Features Section */}
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Your Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 📚 Flashcard Manager Link */}
              <Link 
                to="/flashcards" 
                className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 group"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">📚</span>
                  <h4 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600">
                    Flashcard Manager
                  </h4>
                </div>
                <p className="text-gray-600">
                  Review your flashcards, create new decks, and track your retention.
                </p>
                <div className="mt-4 text-indigo-600 font-medium group-hover:translate-x-1 transition-transform inline-block">
                  Go to Flashcards &rarr;
                </div>
              </Link>

              {/* Placeholder for other features */}
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🧭</span>
                  <h4 className="text-xl font-semibold text-gray-800">Skill Graph</h4>
                </div>
                <p className="text-gray-500">Coming soon...</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
