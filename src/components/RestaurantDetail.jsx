import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaCompass } from 'react-icons/fa';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

function RestaurantDetail({ restaurantId, onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const data = await apiService.get(`/restaurants/${restaurantId}`);
      setRestaurant(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );

  if (error || !restaurant) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 text-red-500 p-6 rounded-3xl mb-4 max-w-sm">
        <p className="font-bold">Error al cargar información</p>
        <p className="text-sm opacity-80">{error || 'No se encontró el lugar'}</p>
      </div>
      <button onClick={onBack} className="text-primary-600 font-bold uppercase tracking-widest text-xs">Volver al listado</button>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-ilo-bg pb-24">
        {/* Hero Section */}
        <div className="relative h-[45vh] lg:h-[60vh]">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Header Controls */}
          <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-center max-w-screen-xl mx-auto">
            <button onClick={onBack} className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/40 transition-all">
              <FaChevronLeft size={20} />
            </button>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white font-black shadow-lg">
              <FaStar className="text-yellow-400" /> {restaurant.rating}
            </div>
          </div>

          {/* Title Area */}
          <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12 max-w-screen-xl mx-auto text-white">
            <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg">
              {restaurant.cuisine || 'Gastronomía'}
            </span>
            <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter leading-tight">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-200">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <FaMapMarkerAlt className="text-primary-400" /> {restaurant.location || restaurant.address}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <FaCompass className="text-primary-400" /> {restaurant.priceRange || '$$'}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-800 mb-6">Sobre este lugar</h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-10">
                  {restaurant.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-5">
                    <div className="bg-primary-50 p-4 rounded-3xl text-primary-500 shadow-inner">
                      <FaClock size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-1">Horario de Atención</h4>
                      <p className="text-gray-500 font-bold">{restaurant.openingHours || '11:00 AM - 10:00 PM'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="bg-primary-50 p-4 rounded-3xl text-primary-500 shadow-inner">
                      <FaPhone size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-1">Contacto</h4>
                      <p className="text-gray-500 font-bold">{restaurant.phone || '+51 9XX XXX XXX'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action for Tourists */}
              <div className="bg-primary-500 rounded-[40px] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 tracking-tight">Experiencia Local</h3>
                  <p className="text-white/80 font-bold max-w-md mb-8">
                    Descubre los mejores sabores de Ilo en este establecimiento. Perfecto para disfrutar en familia o en una cena especial frente al mar.
                  </p>
                  <button
                    onClick={onBack}
                    className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Explorar más lugares
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-6">Ubicación Precisa</h3>
                <div className="aspect-square bg-gray-50 rounded-3xl mb-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 text-gray-400 group cursor-pointer hover:bg-gray-100 transition-colors">
                  <FaMapMarkerAlt size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Ver en el mapa</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-center">Referencia</p>
                  <p className="text-sm font-bold text-gray-700 text-center leading-relaxed">
                    {restaurant.address}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-[40px] p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FaStar size={18} />
                  </div>
                  <h4 className="font-black text-yellow-800 uppercase text-xs tracking-widest">Recomendado</h4>
                </div>
                <p className="text-xs font-bold text-yellow-700/80 leading-relaxed uppercase tracking-wide">
                  Este establecimiento cuenta con el sello de calidad de Ilo Conecta por su excelencia en el servicio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default RestaurantDetail;
