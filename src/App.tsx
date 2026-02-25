import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Home } from './pages/Home';
import { RoomDetail } from './pages/RoomDetail';
import { EndpointDetail } from './pages/EndpointDetail';
import { Library } from './pages/Library';
import { PlaylistBuilder } from './pages/PlaylistBuilder';
import { Presets } from './pages/Presets';
import { ActivityLog } from './pages/ActivityLog';
import { Settings } from './pages/Settings';

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<RoomDetail />} />
          <Route path="/endpoint/:endpointId" element={<EndpointDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlists/:playlistId/edit" element={<PlaylistBuilder />} />
          <Route path="/presets" element={<Presets />} />
          <Route path="/log" element={<ActivityLog />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
