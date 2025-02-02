import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const NavBar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('userId'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-2">
                <ul className="flex space-x-4">
                    <li><Link to="/">Főoldal</Link></li>
                    {isLoggedIn ? (
                        <>
                            <li><Link to="/profile">Profil</Link></li>
                            <li><Link to="/scan">Vonalkód beolvasása</Link></li>
                            <li><Link to="/add-purchase">Vásárlás hozzáadása</Link></li>
                            <li><Link to="/users">Felhasználók listája</Link></li>
                            <li><button onClick={handleLogout}>Kijelentkezés</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/register">Regisztráció</Link></li>
                            <li><Link to="/login">Bejelentkezés</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
