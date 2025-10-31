import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from './contexts/web3-context';
import { CartProvider } from './contexts/cart-context';
import { AuthProvider } from './lib/auth-context';
import App from './App';
import './styles/globals.css';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Web3Provider>
            <CartProvider>
              <App />
            </CartProvider>
          </Web3Provider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// SERVICE WORKER DISABLED - It was blocking Supabase API requests
// Register service worker for PWA functionality
// serviceWorkerRegistration.register({
//   onSuccess: () => {
//     console.log('MyCOW is ready for offline use!');
//   },
//   onUpdate: (registration) => {
//     console.log('New version available! Please refresh.');
//     // You can add UI notification here for updates
//   },
// });