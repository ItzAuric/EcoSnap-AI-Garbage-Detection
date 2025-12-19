import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { WasteLibrary } from './components/WasteLibrary';
import { Analytics } from './components/Analytics';
import { Profile } from './components/Profile';
import { Tracker } from './components/Tracker';
import { Login } from './components/Login';
import { Tab, UserStats, ScanResult, WasteCategory, User } from './types';

// Mock initial user stats
const INITIAL_STATS: UserStats = {
  points: 850,
  streak: 5,
  level: 'Guardian',
  co2Saved: 12.5,
  itemsRecycled: 42
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ecoSnapUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem('ecoSnapUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('ecoSnapUser');
    setCurrentUser(null);
    setActiveTab('home'); // Reset tab
  };

  // Gamification Logic
  const handleScanComplete = (result: ScanResult) => {
    // Award points based on category
    let pointsToAdd = 0;
    if (result.category === WasteCategory.Recyclable) pointsToAdd = 50;
    else if (result.category === WasteCategory.Wet) pointsToAdd = 30;
    else if (result.category === WasteCategory.Hazardous) pointsToAdd = 100; // Bonus for safe disposal
    else pointsToAdd = 10;

    setUserStats(prev => ({
      ...prev,
      points: prev.points + pointsToAdd,
      itemsRecycled: prev.itemsRecycled + 1,
      co2Saved: parseFloat((prev.co2Saved + 0.5).toFixed(1)) // Mock CO2 calc
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard 
            userStats={userStats}
            currentUser={currentUser} 
            onScanClick={() => setActiveTab('scan')} 
            onTrackClick={() => setActiveTab('tracker')}
          />
        );
      case 'scan':
        return <Scanner onScanComplete={handleScanComplete} />;
      case 'library':
        return <WasteLibrary />;
      case 'analytics':
        return <Analytics userStats={userStats} />;
      case 'profile':
        return <Profile userStats={userStats} currentUser={currentUser} onLogout={handleLogout} />;
      case 'tracker':
        return <Tracker onBack={() => setActiveTab('home')} />;
      default:
        return (
          <Dashboard 
            userStats={userStats} 
            currentUser={currentUser}
            onScanClick={() => setActiveTab('scan')} 
            onTrackClick={() => setActiveTab('tracker')}
          />
        );
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-emerald-600">Loading...</div>;
  }

  // Auth Guard
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Mobile-first container */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden">
        
        {/* Main Content Area */}
        <main className={`min-h-screen overflow-y-auto no-scrollbar scroll-smooth ${activeTab !== 'tracker' ? 'px-5 pt-8 pb-20' : ''}`}>
            {renderContent()}
        </main>

        {/* Navigation - Hide tracking bar when in detailed tracking view */}
        {activeTab !== 'tracker' && (
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        
      </div>
      
      {/* Styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default App;