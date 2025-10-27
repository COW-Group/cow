import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../lib/auth-context';
import { ThemeProvider } from '../lib/theme-provider';
import MooPage from '../pages/MooPage';
import '../styles/globals.css';

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="moo-ma-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MooPage />} />
          <Route path="/moo" element={<MooPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
