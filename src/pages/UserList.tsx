import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../services/api';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Felhasználók listája</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Név</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Telefonszám</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Pontok</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Vonalkód</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b border-gray-200">{user.name}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{user.phone_number}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{user.points}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{user.barcode}</td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                    <Link to={`/profile/${user.user_id}`} className="text-blue-500 hover:underline">Profil megtekintése</Link>
                                    <Link to={`/qr-code/${user.user_id}`} className="ml-2 text-blue-500 hover:underline">QR kód</Link>
                                    <Link to={`/add-purchase/${user.user_id}`} className="ml-2 text-blue-500 hover:underline">Vásárlás hozzáadása</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
