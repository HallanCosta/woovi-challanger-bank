import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          style: {
            background: '#10b981',
          },
        },
        error: {
          style: {
            background: '#ef4444',
          },
        },
      }}
    />
  );
}
