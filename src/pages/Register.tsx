import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import PinInput from 'react-pin-input';

interface RegisterForm {
  name: string;
  phoneNumber: string;
  pinCode: string;
}

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      await api.signUp(
        data.name,
        data.phoneNumber,
        data.pinCode
      );
      navigate('/login');
    } catch (error) {
      alert('Hiba történt a regisztráció során. Kérjük próbálja újra!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Regisztráció</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
        <div>
          <label className="block text-gray-300 font-medium mb-2 text-xl">Név</label>
          <input
            {...register('name', { required: 'A név megadása kötelező' })}
            className="w-full p-4 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 text-xl bg-gray-800 text-white"
            placeholder="Add meg a neved"
          />
          {errors.name && (
            <p className="text-red-500 text-lg mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2 text-xl">Telefonszám</label>
          <input
            {...register('phoneNumber', {
              required: 'A telefonszám megadása kötelező',
              pattern: {
                value: /^[0-9+\s-()]*$/,
                message: 'Érvénytelen telefonszám formátum'
              }
            })}
            className="w-full p-4 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 text-xl bg-gray-800 text-white"
            placeholder="Add meg a telefonszámod"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-lg mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2 text-xl">PIN kód</label>
          <PinInput
            length={4}
            focus
            type="numeric"
            inputMode="number"
            style={{ display: 'flex', justifyContent: 'space-between' }}
            inputStyle={{
              width: '60px',
              height: '60px',
              fontSize: '24px',
              borderRadius: '8px',
              borderColor: 'gray',
              backgroundColor: '#1f2937',
              color: 'white',
            }}
            inputFocusStyle={{ borderColor: 'green' }}
            onComplete={(value) => setValue('pinCode', value)}
          />
          {errors.pinCode && (
            <p className="text-red-500 text-lg mt-1">{errors.pinCode.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-green-500 text-white font-bold rounded-lg text-2xl hover:bg-green-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Folyamatban...' : 'Regisztráció'}
        </button>
      </form>
    </div>
  );
};

export default Register;