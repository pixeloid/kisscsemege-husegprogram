import React from 'react';
import { useParams } from 'react-router-dom';
import Barcode from 'react-barcode';
import * as api from '../services/api';
import type { UserProfile } from '../types';
import logo from '../../assets/logo.png';

interface QRCodeState {
  user: UserProfile | null;
  loading: boolean;
  error: string;
}

const QRCodePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [state, setState] = React.useState<QRCodeState>({
    user: null,
    loading: true,
    error: ''
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const data = await api.getUserProfile(userId);
        setState(prev => ({ ...prev, user: data }));
      } catch (error) {
        console.error('Error fetching user:', error);
        setState(prev => ({ ...prev, error: 'Felhasználó nem található' }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUser();
  }, [userId]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Betöltés...</p>
      </div>
    );
  }

  if (state.error || !state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-white">
      <div className="bg-white text-black p-4 rounded-lg shadow-lg" style={{ width: '350px', height: '200px' }}>
        <div className="text-center mb-2">
          <img src="/path/to/logo.png" alt="Kiss Csemege Logo" className="mx-auto mb-2" style={{ width: '50px' }} />
          <h1 className="text-xl font-bold">Kiss Csemege</h1>
          <p className="text-sm">Törzsvásárlói kártya</p>
        </div>
        <div className="text-center mb-2">
          <p className="text-lg font-semibold">{state.user.name}</p>
        </div>
        <div className="flex justify-center">
          <Barcode value={state.user.id} width={1} height={50} fontSize={12} />
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;