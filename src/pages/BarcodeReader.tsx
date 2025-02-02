import React, { useState } from 'react';
import { getUserDataByBarcode } from '../services/api';

interface UserProfile {
    id: string;
    name: string;
    points: number;
}

const BarcodeReader: React.FC = () => {
    const [barcode, setBarcode] = useState('');
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [error, setError] = useState('');

    const handleScan = async () => {
        try {
            const data = await getUserDataByBarcode(barcode);
            setUserData(data);
            setError('');
        } catch (error) {
            setError('Barcode not found or an error occurred.');
            setUserData(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Barcode Reader</h1>
                <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Scan or enter barcode"
                    className="w-full p-4 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 text-xl bg-gray-700 text-white mb-4"
                />
                <button
                    onClick={handleScan}
                    className="w-full p-4 bg-green-500 hover:bg-green-600 rounded-lg text-xl font-semibold"
                >
                    Scan
                </button>
                {userData && (
                    <div className="mt-6">
                        <p>User ID: {userData.id}</p>
                        <p>Name: {userData.name}</p>
                        <p>Points: {userData.points}</p>
                    </div>
                )}
                {error && <p className="mt-6 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default BarcodeReader;
