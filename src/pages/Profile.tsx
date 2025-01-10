import React, { useEffect, useState } from 'react';
import { getUserLevel, getUserPurchases, LEVEL_DISCOUNTS, type Purchase, type UserLevel } from '../services/supabase';

const Profile = () => {
    const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const [level, purchaseHistory] = await Promise.all([
                    getUserLevel(userId),
                    getUserPurchases(userId)
                ]);

                setUserLevel(level);
                setPurchases(purchaseHistory);
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Betöltés...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Level Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Hűségprogram Státusz</h2>
                    {userLevel ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-semibold capitalize">
                                        {userLevel.level} Szint
                                    </p>
                                    <p className="text-gray-600">
                                        {LEVEL_DISCOUNTS[userLevel.level]}% kedvezmény
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">{userLevel.points} pont</p>
                                    <p className="text-gray-600">Összegyűjtött pontok</p>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Következő szint:</h3>
                                {userLevel.level === 'platinum' ? (
                                    <p>Ön elérte a legmagasabb szintet!</p>
                                ) : (
                                    <div>
                                        <p>
                                            {userLevel.level === 'bronze' && 'Ezüst szinthez: még ' + (2000 - userLevel.points) + ' pont'}
                                            {userLevel.level === 'silver' && 'Arany szinthez: még ' + (5000 - userLevel.points) + ' pont'}
                                            {userLevel.level === 'gold' && 'Platina szinthez: még ' + (10000 - userLevel.points) + ' pont'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Nincs elérhető szint információ</p>
                    )}
                </div>

                {/* Purchase History */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Vásárlási Előzmények</h2>
                    {purchases.length > 0 ? (
                        <div className="space-y-4">
                            {purchases.map((purchase) => (
                                <div
                                    key={purchase.id}
                                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold">
                                                {new Date(purchase.purchase_date).toLocaleDateString('hu-HU', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-gray-600">
                                                {purchase.items.length} tétel
                                            </p>
                                        </div>
                                        <p className="font-semibold">
                                            {purchase.total_amount.toLocaleString('hu-HU')} Ft
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <details className="text-sm">
                                            <summary className="cursor-pointer text-green-600 hover:text-green-700">
                                                Tételek mutatása
                                            </summary>
                                            <ul className="mt-2 space-y-1">
                                                {purchase.items.map((item, index) => (
                                                    <li key={index} className="flex justify-between">
                                                        <span>{item.name} ({item.quantity}x)</span>
                                                        <span>{(item.price * item.quantity).toLocaleString('hu-HU')} Ft</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nincs még vásárlási előzmény</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;