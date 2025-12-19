import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaWifi, FaParking, FaSwimmingPool } from 'react-icons/fa';
import PageTransition from './PageTransition';

export default function Hotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const baseUrl = `http://${window.location.hostname}:3001`;
            const response = await fetch(`${baseUrl}/api/hotels`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setHotels(data);
            } else {
                setHotels([]);
            }
        } catch (error) {
            console.error('Error fetching hotels:', error);
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    size={14}
                    className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ilo-bg pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center space-x-3">
                    <Link to="/" className="text-gray-600 hover:text-primary-600">
                        <FaArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Hotels y Hospedaje</h1>
                </div>
            </header>

            {/* Hotels List */}
            <div className="max-w-screen-xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-6">
                    {hotels && Array.isArray(hotels) && hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                {/* Hotel Image */}
                                <div className="relative h-48">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                                        {hotel.priceRange}
                                    </div>
                                </div>

                                {/* Hotel Info */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{hotel.name}</h3>

                                    {/* Rating */}
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="flex space-x-1">
                                            {renderStars(hotel.rating || 0)}
                                        </div>
                                        <span className="text-sm text-gray-600">{hotel.rating || 0}</span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                                    {/* Amenities */}
                                    {hotel.amenities && Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {hotel.amenities.map((amenity, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span>{hotel.rooms || 0} habitaciones</span>
                                        <span>Check-in: {hotel.checkIn || 'N/A'}</span>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition"
                                        onClick={() => alert(`Reservar en ${hotel.name}`)}
                                    >
                                        Ver Disponibilidad
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="text-gray-300 mb-4 flex justify-center">
                                <FaHotel size={64} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron hoteles</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">
                                Asegúrate de haber configurado tu base de datos en Supabase y cargado los datos iniciales.
                            </p>
                            <button
                                onClick={fetchHotels}
                                className="mt-6 text-primary-600 font-bold hover:underline"
                            >
                                Reintentar búsqueda
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
