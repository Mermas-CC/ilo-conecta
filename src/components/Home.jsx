import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaQrcode, FaGlobe, FaLaptop, FaUtensils, FaHotel, FaPlane, FaCalendarAlt, FaUserTie, FaMicrophone, FaSearch } from 'react-icons/fa';
import PageTransition from './PageTransition';

export default function Home() {
    const [routes, setRoutes] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentRouteIndex, setCurrentRouteIndex] = useState(0);

    useEffect(() => {
        fetchRoutes();
        fetchEvents();
    }, []);

    const fetchRoutes = async () => {
        try {
            const baseUrl = `http://${window.location.hostname}:3001`;
            const response = await fetch(`${baseUrl}/api/routes`);
            const data = await response.json();
            setRoutes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching routes:', error);
            setRoutes([]);
        }
    };

    const fetchEvents = async () => {
        try {
            const baseUrl = `http://${window.location.hostname}:3001`;
            const response = await fetch(`${baseUrl}/api/events`);
            const data = await response.json();
            setEvents(Array.isArray(data) ? data.slice(0, 2) : []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        }
    };

    const exploreCategories = [
        { icon: FaMapMarkedAlt, label: 'Atractivos Turísticos', link: '/attractions', color: 'bg-primary-500' },
        { icon: FaQrcode, label: 'Escaner QR', link: '/qr-scanner', color: 'bg-primary-600' },
        { icon: FaGlobe, label: 'Interactivos', link: '/interactive', color: 'bg-primary-700' },
        { icon: FaLaptop, label: 'Plataforma Web', link: '/', color: 'bg-primary-500' },
    ];

    const planCategories = [
        {
            icon: FaUtensils,
            label: 'Restaurantes',
            link: '/restaurants',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop'
        },
        {
            icon: FaHotel,
            label: 'Hotels',
            link: '/hotels',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop'
        },
        {
            icon: FaPlane,
            label: 'Agencias Viaje',
            link: '/agencies',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop'
        },
    ];

    return (
        <PageTransition>
            <div className="min-h-screen pb-20">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo.png"
                                alt="Ilo Conecta"
                                className="w-10 h-10"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2300bcd4" width="100" height="100"/><text x="50" y="50" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">IL</text></svg>';
                                }}
                            />
                            <h1 className="text-xl font-bold text-gray-800">Ilo Conecta</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link to="/profile" className="text-gray-600 hover:text-primary-600">
                                <FaUserTie size={24} />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero Section - Rutas Inteligentes */}
                <section className="px-4 pt-6 pb-4">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 text-white relative overflow-hidden h-48">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Rutas Inteligentes</h2>
                            <p className="text-primary-100 text-sm mb-4">Explora Ilo de manera personalizada</p>
                            <Link
                                to="/routes"
                                className="inline-block bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-primary-50 transition"
                            >
                                Ver Rutas
                            </Link>
                        </div>
                        <div className="absolute right-0 top-0 opacity-20">
                            <FaMapMarkedAlt size={120} />
                        </div>
                    </div>

                    {/* Featured Routes Carousel */}
                    {routes.length > 0 && (
                        <div className="mt-4 flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                            {routes.map((route) => (
                                <Link
                                    key={route.id}
                                    to={`/routes/${route.id}`}
                                    className="flex-shrink-0 w-56"
                                >
                                    <div className="relative rounded-xl overflow-hidden h-32">
                                        <img
                                            src={route.image}
                                            alt={route.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                                            <p className="text-white font-semibold text-sm">{route.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Search Bar */}
                <section className="px-4 pb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Pregúntale a Ilo..."
                            className="w-full px-4 py-3 pr-24 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                            <button className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition">
                                <FaMicrophone size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-primary-600">
                                <FaSearch size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Explora e Infórmate */}
                <section className="px-4 pb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Explora e Infórmate</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {exploreCategories.map((category, index) => (
                            <Link
                                key={index}
                                to={category.link}
                                className="flex flex-col items-center"
                            >
                                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-2 hover:scale-110 transition-transform`}>
                                    <category.icon size={28} />
                                </div>
                                <span className="text-xs text-center text-gray-700 leading-tight">{category.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Planifica tu Ruta */}
                <section className="px-4 pb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Planifica tu Ruta</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {planCategories.map((category, index) => (
                            <Link
                                key={index}
                                to={category.link}
                                className="relative rounded-2xl overflow-hidden h-32 group"
                            >
                                <img
                                    src={category.image}
                                    alt={category.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-4">
                                    <div className="flex items-center space-x-3 text-white">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                            <category.icon size={24} />
                                        </div>
                                        <span className="text-xl font-bold">{category.label}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Experiencias y Eventos */}
                {events.length > 0 && (
                    <section className="px-4 pb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Experiencias y Eventos</h3>
                        <div className="space-y-3">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    to={`/events/${event.id}`}
                                    className="block"
                                >
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition flex items-center space-x-4">
                                        <div className="bg-primary-100 p-4 rounded-lg">
                                            <FaCalendarAlt className="text-primary-600" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(event.date).toLocaleDateString('es-PE', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer Button */}
                <section className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <Link
                        to="/safety"
                        className="block w-full bg-gray-100 text-gray-700 py-3 rounded-full text-center font-semibold hover:bg-gray-200 transition"
                    >
                        Consejos y Seguridad
                    </Link>
                </section>
            </div>
        </PageTransition>
    );
}
