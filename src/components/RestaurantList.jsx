import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Map as MapIcon, List, UtensilsCrossed, Star, Coffee, MapPin, Clock, Fish, Flame, Beer, ArrowLeft, Mic } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';

// Fix for default marker icon
const createMarkerIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin drop-shadow-lg"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const icons = {
  high: createMarkerIcon('#00bcd4'), // Ilo Cyan
  medium: createMarkerIcon('#eab308'), // Yellow
  low: createMarkerIcon('#ef4444'), // Red
};

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/restaurants`);
      if (!response.ok) throw new Error('Error al cargar restaurantes');
      const data = await response.json();

      // Simulate availability for demonstration
      const dataWithAvailability = data.map(r => ({
        ...r,
        availability: Math.random() > 0.6 ? 'high' : (Math.random() > 0.3 ? 'medium' : 'low')
      }));

      setRestaurants(dataWithAvailability);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Todo', icon: <UtensilsCrossed size={20} />, id: 'Todo' },
    { name: 'Mariscos', icon: <Fish size={20} />, id: 'Marina' },
    { name: 'Parrilla', icon: <Flame size={20} />, id: 'Parrilla' },
    { name: 'Café', icon: <Coffee size={20} />, id: 'Café & Brunch' },
    { name: 'Peruana', icon: <UtensilsCrossed size={20} />, id: 'Peruana' },
  ];

  const featuredTabs = [
    { label: 'Relax Inteligentes', color: 'bg-primary-500' },
    { label: 'Eventos con AI', color: 'bg-primary-600' },
    { label: 'Asistencia de Viaje', color: 'bg-primary-700' },
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());

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
        {/* Header - Ilo Conecta Style */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="text-gray-600">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Ilo Conecta</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="p-2 bg-primary-100 text-primary-600 rounded-full"
              >
                {viewMode === 'list' ? <MapIcon size={20} /> : <List size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Filter Tabs (from reference) */}
        <div className="px-4 py-4 flex space-x-3 overflow-x-auto no-scrollbar">
          {featuredTabs.map((tab, idx) => (
            <div key={idx} className={`${tab.color} text-white px-4 py-3 rounded-2xl flex-shrink-0 text-sm font-semibold shadow-sm`}>
              {tab.label}
            </div>
          ))}
        </div>

        {/* Search Bar - Ilo Conecta Style */}
        <div className="px-4 mb-6">
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
        <div className="px-4 mb-8">
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

        {/* Content Area */}
        <div className="px-4">
          {viewMode === 'list' ? (
            <div className="space-y-6">
              {filteredRestaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="relative h-48">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" /> {restaurant.rating}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                      <MapPin size={14} className="text-primary-500" />
                      <span>{restaurant.location || restaurant.address.split(',')[0]}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm font-medium text-gray-600">
                        <span>{restaurant.priceRange}</span>
                        <span>•</span>
                        <span>{restaurant.cuisine}</span>
                      </div>
                      <Link
                        to={`/restaurants/${restaurant.id}`}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-2 rounded-full text-sm transition-all"
                      >
                        Reservar Mesa
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {filteredRestaurants.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No se encontraron restaurantes que coincidan con tu búsqueda.
                </div>
              )}
            </div>
          ) : (
            /* Map View */
            <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
              <MapContainer
                center={[-17.6395, -71.3375]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredRestaurants.map(restaurant => (
                  <Marker
                    key={restaurant.id}
                    position={[-17.6395 + (Math.random() - 0.5) * 0.02, -71.3375 + (Math.random() - 0.5) * 0.02]}
                    icon={icons[restaurant.availability] || icons.high}
                  >
                    <Popup>
                      <div className="text-center p-1">
                        <h3 className="font-bold">{restaurant.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{restaurant.cuisine}</p>
                        <Link
                          to={`/restaurants/${restaurant.id}`}
                          className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold block"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>

        {/* Extra Section: Sertificattos (from reference) */}
        {viewMode === 'list' && (
          <div className="px-4 mt-8 pb-8">
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
        )}
      </div>
    </PageTransition>
  );
}

export default RestaurantList;
