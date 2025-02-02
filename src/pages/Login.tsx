import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    pinCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await api.signIn(formData.phoneNumber, formData.pinCode);
      if (user) {
        localStorage.setItem('userId', user.id);
        navigate('/profile');
      }
    } catch (error) {
      setError('Érvénytelen telefonszám vagy PIN kód');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Bejelentkezés</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2 text-xl">
              Telefonszám
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 text-xl bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2 text-xl">
              PIN kód
            </label>
            <input
              type="password"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 text-xl bg-gray-700 text-white"
              required
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-green-700 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;