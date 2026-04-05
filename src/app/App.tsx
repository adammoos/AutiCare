import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MessagingProvider } from './contexts/MessagingContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MessagingProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </MessagingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
