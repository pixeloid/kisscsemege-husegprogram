import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import PinInput from 'react-pin-input';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phonePrefix: '30',
    phoneNumber: '',
    pinCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneNumberRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullPhoneNumber = formData.phonePrefix + formData.phoneNumber;
      const { user } = await api.signIn(fullPhoneNumber, formData.pinCode);
      if (user) {
        localStorage.setItem('userId', user.id);
        window.dispatchEvent(new Event('storage')); // Trigger storage event to update nav
        navigate('/profile');
      }
    } catch (error) {
      setError('Érvénytelen telefonszám vagy PIN kód');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePinComplete = (value: string) => {
    setFormData(prev => ({ ...prev, pinCode: value }));
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    const regex = /^\d{7}$/;
    return regex.test(phoneNumber);
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
            <div className="flex space-x-2">
              <select
                name="phonePrefix"
                value={formData.phonePrefix}
                onChange={handleInputChange}
                className="p-4 border rounded-lg focus:ring-2 focus:ring-green-500 text-xl bg-gray-700 text-white"
              >
                <option value="30">30</option>
                <option value="20">20</option>
                <option value="70">70</option>
              </select>
              <input
                ref={phoneNumberRef}
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-500 text-xl bg-gray-700 text-white ${isValidPhoneNumber(formData.phoneNumber) ? 'border-gray-700' : 'border-red-500'}`}
                required
              />
            </div>
            {!isValidPhoneNumber(formData.phoneNumber) && (
              <p className="text-red-500 mt-2">Érvényes magyar mobiltelefonszámot adjon meg (7 számjegy)</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2 text-xl">PIN kód</label>
            <PinInput
              length={4}
              type="numeric"
              inputMode="number"
              style={{ display: 'flex', justifyContent: 'space-between' }}
              inputStyle={{
                width: '60px',
                height: '60px',
                fontSize: '24px',
                borderRadius: '8px',
                borderColor: 'gray',
                color: 'white',
              }}
              inputFocusStyle={{ borderColor: 'green' }}
              onComplete={handlePinComplete}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isValidPhoneNumber(formData.phoneNumber)}
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