import React from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../services/supabase';

interface FormState {
  phoneNumber: string;
  pinCode: string;
  loading: boolean;
  error: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = React.useState<FormState>({
    phoneNumber: '',
    pinCode: '',
    loading: false,
    error: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, error: '', loading: true }));

    try {
      const user = await verifyUser(formState.phoneNumber, formState.pinCode);
      if (user) {
        localStorage.setItem('userId', user.id);
        navigate('/profile');
      } else {
        setFormState(prev => ({
          ...prev,
          error: 'Érvénytelen telefonszám vagy PIN kód'
        }));
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: 'Hiba történt a bejelentkezés során'
      }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Bejelentkezés</h1>

        {formState.error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {formState.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Telefonszám
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formState.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="+36 XX XXX XXXX"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              PIN kód
            </label>
            <input
              type="password"
              name="pinCode"
              value={formState.pinCode}
              onChange={handleInputChange}
              maxLength={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="****"
              required
            />
          </div>

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
          >
            {formState.loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;