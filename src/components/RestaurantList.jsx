import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, UtensilsCrossed, Fish, Flame, Coffee, ArrowLeft, Search, Mic, Clock } from 'lucide-react';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const data = await apiService.get('/restaurants');
      setRestaurants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Todo', icon: <UtensilsCrossed size={20} />, id: 'Todo' },
    { name: 'Marinos y Pescados', icon: <Fish size={20} />, id: 'Marinos y Pescados' },
    { name: 'Comida Criolla', icon: <UtensilsCrossed size={20} />, id: 'Comida Criolla' },
    { name: 'Parrillas y Carnes', icon: <Flame size={20} />, id: 'Parrillas y Carnes' },
    { name: 'Pollerías y Cafeterías', icon: <Coffee size={20} />, id: 'Pollerías y Cafeterías' },
  ];

  const featuredTabs = [
    { label: 'Relax Inteligentes', color: 'bg-primary-500' },
    { label: 'Eventos con AI', color: 'bg-primary-600' },
    { label: 'Asistencia de Viaje', color: 'bg-primary-700' },
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch = (r.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (r.cuisine?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory === 'Todo') return true;
      return r.cuisine === selectedCategory || r.category === selectedCategory;
    });
  }, [restaurants, selectedCategory, searchQuery]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-ilo-bg pb-20">
        {/* Header - Ilo Conecta Style - Solo móvil */}
        <header className="bg-white shadow-sm sticky top-0 z-40 lg:hidden">
          <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="text-gray-600">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Ilo Conecta</h1>
            </div>
          </div>
        </header>

        {/* Featured Filter Tabs */}
        <div className="px-4 py-4 flex space-x-3 overflow-x-auto no-scrollbar max-w-screen-xl mx-auto">
          {featuredTabs.map((tab, idx) => (
            <div key={idx} className={`${tab.color} text-white px-4 py-3 rounded-2xl flex-shrink-0 text-sm font-semibold shadow-sm`}>
              {tab.label}
            </div>
          ))}
        </div>

        {/* Search Bar - Ilo Conecta Style */}
        <div className="max-w-screen-xl mx-auto px-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Pregúntale a Ilo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Mic className="text-primary-500" size={20} />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-screen-xl mx-auto px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Restaurantes</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 min-w-[80px] transition-all ${selectedCategory === cat.id ? 'text-primary-600' : 'text-gray-500'
                  }`}
              >
                <div className={`p-4 rounded-full transition-all ${selectedCategory === cat.id ? 'bg-primary-100' : 'bg-white border border-gray-100'
                  }`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Pure List Layout */}
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map(restaurant => (
              <div
                key={restaurant.id}
                className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-56">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" /> {restaurant.rating}
                  </div>
                </div>

                <div className="p-6 h-full flex flex-col">
                  <h3 className="text-xl font-black text-gray-800 mb-2 truncate">{restaurant.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 font-bold mb-6">
                    <MapPin size={16} className="text-primary-500" />
                    <span className="uppercase tracking-wider">{restaurant.location || restaurant.address.split(',')[0]}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">
                      <span>{restaurant.pricerange}</span>
                      <span className="text-gray-300">•</span>
                      <span>{restaurant.cuisine}</span>
                    </div>
                    <Link
                      to={`/restaurants/${restaurant.id}`}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-black px-6 py-2.5 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary-500/20 active:scale-95 whitespace-nowrap"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {filteredRestaurants.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-8">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No se encontraron sabores...</p>
              </div>
            )}
          </div>
        </div>

        {/* Extra Section: Sertificattos */}
        <div className="max-w-screen-xl mx-auto px-4 mt-12 pb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Certificados</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex-shrink-0 w-48 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <Star size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Calidad Premium</h4>
                <p className="text-[10px] text-gray-500 italic">Ilo Conecta Verified</p>
              </div>
            </div>
            <div className="flex-shrink-0 w-48 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Siempre Abierto</h4>
                <p className="text-[10px] text-gray-500 italic">Horarios Flexibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default RestaurantList;
