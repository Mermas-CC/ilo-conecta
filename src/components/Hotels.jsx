import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaWifi, FaParking, FaSwimmingPool, FaHotel } from 'react-icons/fa';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

export default function Hotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const data = await apiService.get('/hotels');
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
            {/* Header - Solo móvil */}
            <header className="bg-white shadow-sm sticky top-0 z-40 lg:hidden">
                <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center space-x-3">
                    <Link to="/" className="text-gray-600 hover:text-primary-600">
                        <FaArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Hotels y Hospedaje</h1>
                </div>
            </header>

            {/* Hotels List - Responsive Grid */}
            <div className="max-w-screen-xl mx-auto px-4 py-8 lg:py-12">
                <h2 className="text-3xl font-black text-gray-800 mb-8 hidden lg:block uppercase tracking-tighter">Hospedajes en Ilo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hotels && Array.isArray(hotels) && hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 group flex flex-col"
                            >
                                {/* Hotel Image */}
                                <div className="relative h-64">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-xs font-black text-primary-600 shadow-sm border border-white/20">
                                        {hotel.priceRange}
                                    </div>
                                    <div className="absolute bottom-4 left-4 flex space-x-1">
                                        {renderStars(hotel.rating || 0)}
                                    </div>
                                </div>

                                {/* Hotel Info */}
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-none">{hotel.name}</h3>

                                    <p className="text-gray-400 text-sm font-bold mb-6 line-clamp-2 uppercase tracking-wide">{hotel.description}</p>

                                    {/* Amenities */}
                                    {hotel.amenities && Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-1.5 bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-xl"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                            {hotel.amenities.length > 3 && (
                                                <span className="px-3 py-1.5 text-gray-400 text-[10px] font-black tracking-widest">+ {hotel.amenities.length - 3}</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                                        <span>Hab.: {hotel.rooms || 0}</span>
                                        <span>Check-in: {hotel.checkIn || 'N/A'}</span>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        className="mt-6 w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary-500/20 active:scale-95 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
                                        onClick={() => { }}
                                    >
                                        Ver más
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
