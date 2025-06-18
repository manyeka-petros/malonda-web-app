import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './Auth/AuthContext'; // ✅ ADD THIS LINE

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Wrap your app inside AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
