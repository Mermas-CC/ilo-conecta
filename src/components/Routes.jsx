import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaClock, FaMap, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import PageTransition from './PageTransition';

export default function Routes() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutes();
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

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-20">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center space-x-3">
                        <Link to="/" className="text-gray-600 hover:text-primary-600">
                            <FaArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Rutas Turísticas</h1>
                    </div>
                </header>

                {/* Routes List */}
                <div className="max-w-screen-xl mx-auto px-4 py-6">
                    <div className="space-y-6">
                        {routes.map((route) => (
                            <Link
                                key={route.id}
                                to={`/routes/${route.id}`}
                                className="block"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                                    {/* Route Image */}
                                    <div className="relative h-48">
                                        <img
                                            src={route.image}
                                            alt={route.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-700">
                                            {route.difficulty}
                                        </div>
                                    </div>

                                    {/* Route Info */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{route.description}</p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <FaClock className="text-primary-500" />
                                                <span>{route.duration}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FaMapMarkerAlt className="text-primary-500" />
                                                <span>{route.stops.length} paradas</span>
                                            </div>
                                            {route.totalDistance && (
                                                <div className="flex items-center space-x-1">
                                                    <FaMap className="text-primary-500" />
                                                    <span>{route.totalDistance}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Interests Tags */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {route.interests.map((interest, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
