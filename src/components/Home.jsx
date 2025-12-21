import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaQrcode, FaGlobe, FaLaptop, FaUtensils, FaHotel, FaPlane, FaCalendarAlt, FaUserTie, FaMicrophone, FaSearch } from 'react-icons/fa';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

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
            const data = await apiService.get('/routes');
            setRoutes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching routes:', error);
            setRoutes([]);
        }
    };

    const fetchEvents = async () => {
        try {
            const data = await apiService.get('/events');
            setEvents(Array.isArray(data) ? data.slice(0, 2) : []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        }
    };

    const exploreCategories = [
        { icon: FaMapMarkedAlt, label: 'Lugares', link: '/attractions', color: 'bg-primary-500' },
        { icon: FaQrcode, label: 'Escaner QR', link: '/qr-scanner', color: 'bg-primary-600' },
        { icon: FaGlobe, label: 'Interactivos', link: '/interactive', color: 'bg-primary-700' },
        { icon: FaLaptop, label: 'Plataforma Web', link: '/', color: 'bg-primary-500' },
    ];

    const planCategories = [
        {
            icon: FaUtensils,
            label: 'Restaurantes',
            link: '/restaurants',
            image: '/IMG ILO CONECTA/IMG RESTAURANTES/NAYAR RESTAURANTE.jpg'
        },
        {
            icon: FaHotel,
            label: 'Hospedaje',
            link: '/hotels',
            image: '/IMG ILO CONECTA/IMG HOSPEDAJE/VIP HOTEL ILO.png'
        },
        {
            icon: FaPlane,
            label: 'Agencias Viaje',
            link: '/agencies',
            image: '/IMG ILO CONECTA/IMG LUGARES/MALECON COSTERO.jpg'
        },
    ];

    return (
        <PageTransition>
            <div className="min-h-screen pb-20">
                {/* Header - Solo visible en móvil, DesktopNav se encarga de escritorio */}
                <header className="bg-white shadow-sm sticky top-0 z-40 lg:hidden">
                    <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/IMG ILO CONECTA/LOGO/LOGO DE ILO CONECTA.jpg"
                                alt="Ilo Conecta"
                                className="w-10 h-10 object-contain"
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
                <section className="px-4 pb-12 max-w-screen-xl mx-auto">
                    <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center">
                        <span className="w-8 h-8 bg-primary-500 rounded-lg mr-3 shadow-lg shadow-primary-500/20"></span>
                        Planifica tu Ruta
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {planCategories.map((category, index) => (
                            <Link
                                key={index}
                                to={category.link}
                                className="relative rounded-[32px] overflow-hidden h-60 group shadow-xl hover:shadow-2xl transition-all duration-500"
                            >
                                <img
                                    src={category.image}
                                    alt={category.label}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                                    <div className="flex items-center space-x-4 text-white transform group-hover:translate-x-2 transition-transform">
                                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                            <category.icon size={24} />
                                        </div>
                                        <span className="text-2xl font-black uppercase tracking-tight">{category.label}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Experiencias y Eventos */}
                {events.length > 0 && (
                    <section className="px-4 pb-12 max-w-screen-xl mx-auto">
                        <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center">
                            <span className="w-8 h-8 bg-cyan-500 rounded-lg mr-3 shadow-lg shadow-cyan-500/20"></span>
                            Experiencias y Eventos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    to={`/events/${event.id}`}
                                    className="block group"
                                >
                                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:border-primary-100 transition-all duration-300 flex items-center space-x-6">
                                        <div className="bg-primary-50 p-6 rounded-2xl group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                                            <FaCalendarAlt size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-xl text-gray-800 group-hover:text-primary-600 transition-colors">{event.title}</h4>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                {new Date(event.date).toLocaleDateString('es-PE', {
                                                    day: 'numeric',
                                                    month: 'long',
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

                {/* Footer Button - Solo visible en móvil, oculto en Desktop por DesktopNav */}
                <section className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 lg:hidden z-40">
                    <Link
                        to="/safety"
                        className="block w-full bg-primary-500 text-white py-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all"
                    >
                        Consejos y Seguridad
                    </Link>
                </section>

                {/* Footer Desktop */}
                <footer className="hidden lg:block bg-white border-t border-gray-100 py-12 mt-12">
                    <div className="max-w-screen-xl mx-auto px-6 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">I</div>
                            <span className="text-lg font-black text-gray-800">Ilo<span className="text-primary-500">Conecta</span></span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium italic">"Conectando la ciudad puerto con el mundo"</p>
                        <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            <span>© 2025 Ilo Conecta</span>
                            <div className="flex space-x-6">
                                <Link to="/safety" className="hover:text-primary-500">Seguridad</Link>
                                <Link to="/privacy" className="hover:text-primary-500">Privacidad</Link>
                                <Link to="/terms" className="hover:text-primary-500">Términos</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </PageTransition>
    );
}
