import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md">
      <img 
        src="/kc-logo.png" 
        alt="Kiss Csemege Logo" 
        className="h-32 w-32 mx-auto mb-8"
      />
      
      <Link 
        to="/register"
        className="block w-full bg-green-600 text-white text-lg py-4 px-6 rounded-lg mb-4 text-center hover:bg-green-700 transition-colors"
      >
        Regisztráció
      </Link>
      
      <Link 
        to="/login"
        className="block w-full bg-white text-green-600 text-lg py-4 px-6 rounded-lg border-2 border-green-600 text-center hover:bg-green-50 transition-colors"
      >
        Bejelentkezés QR kóddal
      </Link>
    </div>
  </div>
);

export default Home;