import React from 'react';
import { useParams } from 'react-router-dom';
import Barcode from 'react-barcode';
import { supabase } from '../services/supabase';
import type { User } from '../services/supabase';

interface QRCodeState {
  user: User | null;
  loading: boolean;
}

const QRCodePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [state, setState] = React.useState<QRCodeState>({
    user: null,
    loading: true
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('id', userId)
          .single();

        if (error) throw error;
        setState(prev => ({ ...prev, user: data }));
      } catch (error) {
        console.error('Error fetching user:', error);
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

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">Felhasználó nem található</p>
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