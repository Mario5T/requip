import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import UserList from './pages/UserList';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import ViewUser from './pages/ViewUser';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserList />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/:id" element={<ViewUser />} />
            <Route path="users/:id/edit" element={<EditUser />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 4000,
          style: {
            background: '#12121a',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
          },
          success: {
            iconTheme: { primary: '#00d4aa', secondary: '#12121a' },
          },
          error: {
            iconTheme: { primary: '#ff6b6b', secondary: '#12121a' },
          },
        }}
      />
    </QueryClientProvider>
  );
}
