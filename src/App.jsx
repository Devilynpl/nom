import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useVibePoints } from './hooks/useVibePoints';
import { usePlayerStore } from './store/usePlayerStore';
import { useSocketStore } from './store/useSocketStore';
import { useDynamicTheme } from './hooks/useDynamicTheme';

import TopBar from './components/layout/TopBar';
import VibeLayout from './components/layout/VibeLayout';
import WaterBackground from './components/effects/WaterBackground';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Library from './components/Library';
import Player from './components/Player';
import Profile from './components/Profile';
import Premium from './components/Premium';
import Community from './components/Community';
import Explore from './components/Explore';
import Shop from './components/Shop';
import Login from './components/Login';
import VersePingPong from './components/games/VersePingPong';
import Forum from './components/Forum';
import LyricAssistant from './components/tools/LyricAssistant';
import BeatMatcher from './components/tools/BeatMatcher';
import ChordWizard from './components/tools/ChordWizard';
import RapBattleArena from './components/games/RapBattleArena';
import ServicesHub from './components/ServicesHub';
import CollabStation from './components/CollabStation';
import VoiceFX from './components/tools/VoiceFX';
import VideoBackground from './components/layout/VideoBackground';
import RoadToVinyl from './components/RoadToVinyl';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalSearch from './components/GlobalSearch';
import CreatePage from './components/CreatePage';
import WorldCanvas from './components/world/WorldCanvas';
import AdminDashboard from './components/admin/AdminDashboard';
import EasterEggCoins from './components/ui/EasterEggCoins';
import VibeMontage from './components/VibeMontage';

import './App.css';
import posiedzenieSrc from './assets/sound/mp3/Posiedzenie.mp3';

const PageLayout = ({ children }) => (
  <div className="h-full overflow-y-auto p-6 scrollbar-hide pb-32">
    {children}
  </div>
);

function App() {
  const { user: authUser, loading, isAdmin } = useAuth();
  const { theme, effectsEnabled } = useTheme();
  const [activePage, setActivePage] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);

  const { user: pointsUser, addPoints, getLeaderboard, upgradeTier } = useVibePoints({
    id: 'alex_vibe',
    name: 'Age of Vanity',
    vibePoints: 850,
    vinylThreshold: 50000,
    referralLink: 'vibe.music/join/alex_vibe_99',
    tracks: [], // No dummy tracks
  });

  const { playTrack, stop } = usePlayerStore();
  const { connect } = useSocketStore();
  useDynamicTheme();


  useEffect(() => {
    connect();
    playTrack({
      title: 'Posiedzenie',
      artist: 'Age of Vanity',
      duration: '4:20', // Approx, can be updated later
      cover: 'https://images.unsplash.com/photo-1621360841013-c768371e93cf?q=80&w=300&auto=format&fit=crop',
      audioUrl: posiedzenieSrc,
      mood: 'chill'
    });
    stop();
  }, [connect, playTrack, stop]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) return <div className="loading-screen text-white flex items-center justify-center h-screen bg-black">Initializing VibeOS...</div>;

  const currentUser = authUser ? {
    ...pointsUser,
    id: authUser.id,
    name: authUser.user_metadata?.username || pointsUser.name,
    email: authUser.email,
    user_metadata: authUser.user_metadata
  } : null;

  const renderPage = () => {
    switch (activePage) {
      case 'profile': return <PageLayout><Profile user={currentUser} /></PageLayout>;
      case 'community': return <PageLayout><Community fetchLeaderboard={getLeaderboard} /></PageLayout>;
      case 'explore': return <PageLayout><Explore onNavigate={setActivePage} /></PageLayout>;
      case 'shop': return <PageLayout><Shop onPurchase={(amt) => addPoints(amt, 'SHOP')} /></PageLayout>;
      case 'premium': return <PageLayout><Premium onUpgrade={async (t) => {
        try { const msg = await upgradeTier(t); alert(msg); } catch (e) { alert('Upgrade failed: ' + e.message); }
      }} /></PageLayout>;
      case 'game': return <PageLayout><VersePingPong /></PageLayout>;
      case 'forum': return <PageLayout><Forum /></PageLayout>;
      case 'create': return <PageLayout><CreatePage onNavigate={setActivePage} /></PageLayout>; // Added route
      case 'lyric-assistant': return <PageLayout><LyricAssistant /></PageLayout>;
      case 'beat-matcher': return <PageLayout><BeatMatcher /></PageLayout>;
      case 'chord-wizard': return <PageLayout><ChordWizard /></PageLayout>;
      case 'rap-battle': return <PageLayout><RapBattleArena /></PageLayout>;
      case 'services': return <PageLayout><ServicesHub /></PageLayout>;
      case 'collab': return <PageLayout><CollabStation /></PageLayout>;
      case 'voice-fx': return <PageLayout><VoiceFX /></PageLayout>;
      case 'road-to-vinyl': return <PageLayout><RoadToVinyl /></PageLayout>;
      case 'world': return <WorldCanvas />;
      case 'admin-dashboard':
        if (isAdmin) {
          return <PageLayout><AdminDashboard /></PageLayout>;
        } else {
          return <PageLayout><div className="flex items-center justify-center h-full text-red-500 text-2xl font-bold font-mono">ACCESS_DENIED: INSUFFICIENT_PERMISSIONS</div></PageLayout>;
        }
      case 'analytics': return <PageLayout><div className="text-white">Analytics Dashboard (Coming Soon)</div></PageLayout>;
      case 'vibe-montage': return <PageLayout><VibeMontage /></PageLayout>;
      case 'library': return <PageLayout><Library /></PageLayout>;
      case 'home':
      default: return <PageLayout><Feed onRate={() => addPoints(5, 'RATE')} /></PageLayout>;
    }
  };

  return (
    <div
      className="app-container relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: theme === 'light' ? '#f5f3ed' : '#0a0c12' }}
    >
      {!['community', 'world'].includes(activePage) && (
        <WaterBackground
          imageUrl="/logo2-light.png"
          backgroundColor={theme === 'light' ? '#f5f3ed' : '#0a0c12'}
          animated={effectsEnabled}
        />
      )}

      {!authUser ? (
        <div className="relative z-10 w-full h-full">
          <Login />
        </div>
      ) : (
        <div className="relative z-10 flex flex-col h-full">
          <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          <VibeLayout
            sidebar={<Sidebar activePage={activePage} setActivePage={setActivePage} />}
            center={
              <main className="flex flex-col relative w-full h-full overflow-hidden">
                <TopBar
                  activePage={activePage}
                  user={currentUser}
                  onSearchClick={() => setSearchOpen(true)}
                />
                <div className="flex-1 overflow-hidden relative">
                  {renderPage()}
                </div>
              </main>
            }
          />
          <Player />
          <EasterEggCoins
            onCoinCollected={(type, value) => {
              console.log(`Collected ${type} coin worth ${value}!`);
              // TODO: Update user balance in store
              addPoints(value * 100); // Convert coins to Vibe Points
            }}
          />
        </div>
      )}
    </div>
  );
}

const AppWrapper = () => (
  <ErrorBoundary>
    <AuthProvider>
      <NotificationProvider>
        <LanguageProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </LanguageProvider>
      </NotificationProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default AppWrapper;
