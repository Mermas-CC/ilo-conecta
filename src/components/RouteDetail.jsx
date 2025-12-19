import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaPlay, FaUtensils, FaCameraRetro } from 'react-icons/fa';
import PageTransition from './PageTransition';

export default function RouteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchRoute();
    }, [id]);

    const fetchRoute = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/routes/${id}`);
            const data = await response.json();
            setRoute(data);
        } catch (error) {
            console.error('Error fetching route:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!route) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-gray-600 mb-4">Ruta no encontrada</p>
                <Link to="/routes" className="text-primary-600 hover:underline">
                    Volver a rutas
                </Link>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-20">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center space-x-3">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-primary-600">
                            <FaArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">Ilo Conecta</h1>
                    </div>
                </header>

                {/* Image Carousel */}
                <div className="relative h-64 bg-gray-200">
                    <img
                        src={route.image}
                        alt={route.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {/* Simplified carousel dots */}
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    </div>
                </div>

                {/* Route Title Card */}
                <div className="max-w-screen-xl mx-auto px-4 py-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                        <div className="flex items-start space-x-3 mb-4">
                            <div className="bg-primary-100 p-3 rounded-full">
                                <FaMapMarkerAlt className="text-primary-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{route.name}</h2>
                                <p className="text-gray-600 text-sm mt-1">{route.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <FaClock className="text-primary-500" />
                                <span>{route.duration}</span>
                            </div>
                            <div className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
                                {route.difficulty}
                            </div>
                        </div>
                    </div>

                    {/* Planifica tu Ruta */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Planifica tu Ruta</h3>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            {route.stops && route.stops.map((stop, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start p-6 ${index !== route.stops.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <div className="relative flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm z-10 relative shadow-lg ${stop.type === 'Gastronomía' ? 'bg-orange-500' : 'bg-primary-500'}`}>
                                            {stop.type === 'Gastronomía' ? <FaUtensils size={16} /> : <FaCameraRetro size={16} />}
                                        </div>
                                        {index !== route.stops.length - 1 && (
                                            <div className="absolute top-10 w-0.5 h-full bg-gray-100"></div>
                                        )}
                                    </div>
                                    <div className="ml-6 flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-gray-800 text-lg">{stop.name}</h4>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${stop.type === 'Gastronomía' ? 'bg-orange-50 text-orange-600' : 'bg-primary-50 text-primary-600'}`}>
                                                {stop.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-snug">{stop.description}</p>
                                        <div className="flex items-center space-x-3 mt-3">
                                            <div className="flex items-center text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                                <FaClock size={10} className="mr-1.5" />
                                                <span>{stop.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Start Route Button */}
                    <button
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
                        onClick={() => alert('Iniciando ruta...')}
                    >
                        <FaPlay />
                        <span>Iniciar Ruta</span>
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}
