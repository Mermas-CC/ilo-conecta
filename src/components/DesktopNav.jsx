import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaMapMarkedAlt, FaUtensils, FaHotel, FaCalendarAlt, FaUser, FaInfoCircle } from 'react-icons/fa';

export default function DesktopNav() {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', path: '/', icon: <FaHome /> },
        { name: 'Rutas', path: '/routes', icon: <FaMapMarkedAlt /> },
        { name: 'Lugares', path: '/attractions', icon: <FaInfoCircle /> },
        { name: 'Restaurantes', path: '/restaurants', icon: <FaUtensils /> },
        { name: 'Hoteles', path: '/hotels', icon: <FaHotel /> },
        { name: 'Eventos', path: '/events', icon: <FaCalendarAlt /> },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden lg:block ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <span className="font-black text-xl">I</span>
                    </div>
                    <span className={`text-xl font-black tracking-tighter transition-colors ${scrolled ? 'text-gray-800' : 'text-gray-800'
                        }`}>
                        Ilo<span className="text-primary-500">Conecta</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <ul className="flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary-500 ${location.pathname === link.path ? 'text-primary-500 border-b-2 border-primary-500 pb-1' : 'text-gray-600'
                                    }`}
                            >
                                <span className="text-xs">{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* User Actions */}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center space-x-2 group">
                                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 border-2 border-white shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                    <FaUser size={14} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 hidden xl:block">
                                    {user?.name?.split(' ')[0]}
                                </span>
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 uppercase tracking-widest"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-primary-500 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-primary-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:scale-105 transition-all"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
