import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const AddPurchase = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([{ name: '', quantity: 1, price: 0, item_code: '' }]);
    const [receiptNumber, setReceiptNumber] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const calculateTotalAmount = () => {
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalAmount(total);
        };

        calculateTotalAmount();
    }, [items]);

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0, item_code: '' }]);
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userId = localStorage.getItem('userId');
            await api.addPurchase(userId!, totalAmount, items, receiptNumber);
            navigate('/profile');
        } catch (error) {
            console.error('Error adding purchase:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Add Purchase</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Receipt Number</label>
                    <input
                        type="text"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        className="w-full mt-2 p-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Items</label>
                    {items.map((item, index) => (
                        <div key={index} className="flex space-x-2 mt-2">
                            <input
                                type="text"
                                placeholder="Name"
                                value={item.name}
                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                className="w-1/4 p-2 border rounded-lg"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                className="w-1/4 p-2 border rounded-lg"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                className="w-1/4 p-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Item Code"
                                value={item.item_code}
                                onChange={(e) => handleItemChange(index, 'item_code', e.target.value)}
                                className="w-1/4 p-2 border rounded-lg"
                                required
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="mt-2 text-green-600 hover:text-green-700">
                        Add Item
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Total Amount</label>
                    <input
                        type="number"
                        value={totalAmount}
                        readOnly
                        className="w-full mt-2 p-2 border rounded-lg"
                    />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Purchase'}
                </button>
            </form>
        </div>
    );
};

export default AddPurchase;
