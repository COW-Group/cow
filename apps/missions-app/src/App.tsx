import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { ThemeStyler } from './components/theme/ThemeStyler';
import { RouterSetup } from './components/routing/RouterSetup';
import './styles.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <ThemeStyler />
        <Router>
          <RouterSetup />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}