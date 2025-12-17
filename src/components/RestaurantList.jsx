import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Map as MapIcon, List, Pizza, UtensilsCrossed, Star, Coffee, Zap, MapPin, Clock, Fish, Flame, Beer } from 'lucide-react';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const createMarkerIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin drop-shadow-lg"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const icons = {
  high: createMarkerIcon('#22c55e'), // Green
  medium: createMarkerIcon('#eab308'), // Yellow
  low: createMarkerIcon('#ef4444'), // Red
};

function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/restaurants`);
      if (!response.ok) throw new Error('Error al cargar restaurantes');
      const data = await response.json();

      // Simulate availability for demonstration (High, Medium, Low)
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
    { name: 'Todo', icon: <UtensilsCrossed size={24} />, id: 'Todo' },
    { name: 'Mariscos', icon: <Fish size={24} />, id: 'Mariscos' },
    { name: 'Parrilla', icon: <Flame size={24} />, id: 'Parrilla' },
    { name: 'Cafetería', icon: <Coffee size={24} />, id: 'Cafetería' },
    { name: 'Bar & Grill', icon: <Beer size={24} />, id: 'Bar & Grill' },
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'Todo') return true;
      if (selectedCategory === 'Top') return r.rating >= 4.5;

      // Match cuisine for other categories
      return r.cuisine === selectedCategory;
    });
  }, [restaurants, selectedCategory, searchQuery]);

  if (loading) return <div className="text-center py-12 text-xl text-mesa-text">Cargando restaurantes...</div>;
  if (error) return <div className="text-center py-12 text-xl text-red-600">Error: {error}</div>;

  // Default center (Ilo, Peru)
  const center = [-17.6395, -71.3375];

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight mb-2">Explorar</h1>
            <p className="text-gray-500">Descubre los mejores lugares para comer</p>
          </div>

          <div className="bg-gray-100 p-1.5 rounded-xl flex">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={18} /> Lista
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${viewMode === 'map' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MapIcon size={18} /> Mapa
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={24} />
          </div>
          <input
            type="text"
            placeholder="¿Qué se te antoja hoy?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-200 transition-all shadow-sm hover:shadow-md text-lg"
          />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex flex-col items-center gap-3 min-w-[100px] p-4 rounded-2xl border transition-all cursor-pointer ${selectedCategory === cat.id
                ? 'bg-orange-50 border-orange-200 shadow-md'
                : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-md'
                }`}
            >
              <span className={`text-3xl p-4 rounded-full transition-transform duration-300 group-hover:scale-110 ${selectedCategory === cat.id ? 'bg-white text-mesa-orange' : 'bg-orange-50 text-gray-600'
                }`}>
                {cat.icon}
              </span>
              <span className={`text-sm font-bold ${selectedCategory === cat.id ? 'text-mesa-orange' : 'text-gray-600 group-hover:text-mesa-orange'
                }`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative rounded-3xl border border-mesa-sidebar bg-white shadow-inner mx-4 mb-4" style={{ minHeight: '600px', height: 'calc(100vh - 400px)' }}>
        {viewMode === 'list' ? (
          <div className="h-full overflow-y-auto p-4">
            {/* List/Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  onClick={() => onSelectRestaurant(restaurant.id)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-mesa-orange hover:scale-[1.02] transform"
                >
                  <div className="relative h-48">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" /> {restaurant.rating}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-mesa-text mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{restaurant.cuisine}</p>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin size={14} />
                        <span className="truncate">{restaurant.address.split(',')[0]}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectRestaurant(restaurant.id)}
                      className="w-full bg-mesa-orange hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>Ver Mesa</span>
                      <Clock size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Map View */
          <div className="h-full w-full" style={{ minHeight: '600px' }}>
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              whenReady={() => {
                console.log('Map is ready!');
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredRestaurants.map(restaurant => (
                restaurant.lat && restaurant.lng && (
                  <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lng]} icon={icons[restaurant.availability] || icons.high}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                        <div className={`mt-1 text-xs font-bold ${restaurant.availability === 'high' ? 'text-green-600' :
                          restaurant.availability === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {restaurant.availability === 'high' ? 'Alta Disponibilidad' :
                            restaurant.availability === 'medium' ? 'Pocos Lugares' : 'Casi Lleno'}
                        </div>
                        <button
                          onClick={() => onSelectRestaurant(restaurant.id)}
                          className="mt-2 bg-mesa-orange text-white px-4 py-2 rounded-lg text-sm font-bold"
                        >
                          Ver Mesas
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}

              {/* Legend */}
              <div className="leaflet-bottom leaflet-right m-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-[1000]">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Disponibilidad</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-gray-700">Alta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs font-medium text-gray-700">Media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs font-medium text-gray-700">Baja</span>
                  </div>
                </div>
              </div>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantList;
