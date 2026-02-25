import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Home } from './pages/Home';
import { RoomDetail } from './pages/RoomDetail';
import { EndpointDetail } from './pages/EndpointDetail';
import { Library } from './pages/Library';
import { PlaylistBuilder } from './pages/PlaylistBuilder';
import { PlaylistNew } from './pages/PlaylistNew';
import { Presets } from './pages/Presets';
import { PresetBuilder } from './pages/PresetBuilder';
import { Settings } from './pages/Settings';
import { Info } from './pages/Info';

function ThemeApplicator({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.uiState.theme === 'dark');
  }, [state.uiState.theme]);
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg">
      <div className="text-center">
        <div className="text-6xl mb-4">📺</div>
        <h1 className="text-2xl font-bold text-neo-text">Page not found</h1>
        <a href="/" className="text-neo-accent text-sm mt-3 inline-block hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ThemeApplicator>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<RoomDetail />} />
            <Route path="/endpoint/:endpointId" element={<EndpointDetail />} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlists/new" element={<PlaylistNew />} />
            <Route path="/playlists/:playlistId/edit" element={<PlaylistBuilder />} />
            <Route path="/presets" element={<Presets />} />
            <Route path="/presets/new" element={<PresetBuilder />} />
            <Route path="/presets/:presetId/edit" element={<PresetBuilder />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/info" element={<Info />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeApplicator>
    </AppProvider>
  );
}
