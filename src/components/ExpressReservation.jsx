import { Clock, MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react';
import apiService from '../services/apiService';

function ExpressReservation() {
    const [guests, setGuests] = useState(2);
    const [when, setWhen] = useState('now');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            // Calculate date and time based on 'when'
            const now = new Date();
            let date = now.toISOString().split('T')[0];
            let time = '13:00'; // Default fallback

            if (when === 'now') {
                // Round to next 30 min slot
                const minutes = now.getMinutes();
                const hour = now.getHours();
                if (minutes < 30) {
                    time = `${hour}:30`;
                } else {
                    time = `${hour + 1}:00`;
                }
            } else {
                // Tonight = 20:00
                time = '20:00';
            }

            // Format time correctly (HH:mm)
            // Simple fix for single digit hours if needed, though getHours returns 0-23

            const data = await apiService.get(`/search/availability?date=${date}&time=${time}&guests=${guests}`);
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickBook = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    };

    return (
        <div className="h-full flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-mesa-sidebar max-w-5xl w-full flex flex-col gap-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-mesa-orange font-bold text-sm mb-4">
                            ⚡ MODO EXPRESS
                        </span>
                        <h1 className="text-5xl font-bold text-mesa-text mb-6 leading-tight">
                            ¿Hambre ahora mismo?
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Encuentra una mesa disponible en los próximos 30 minutos cerca de ti. Sin esperas.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-mesa-text">150+</span>
                                <span className="text-xs text-gray-400 uppercase font-bold">Restaurantes</span>
                            </div>
                            <div className="w-px bg-gray-200"></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-mesa-text">5min</span>
                                <span className="text-xs text-gray-400 uppercase font-bold">Promedio</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full bg-mesa-bg p-8 rounded-3xl shadow-inner">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">¿Cuántas personas?</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setGuests(num)}
                                            className={`py-3 rounded-xl font-bold transition-all ${guests === num
                                                ? 'bg-mesa-orange text-white shadow-md scale-105'
                                                : 'bg-white text-gray-500 hover:bg-orange-50'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">¿Cuándo?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setWhen('now')}
                                        className={`py-4 px-4 rounded-xl font-bold text-left transition-all flex items-center justify-between ${when === 'now'
                                            ? 'bg-white border-2 border-mesa-orange text-mesa-orange shadow-sm'
                                            : 'bg-white border-2 border-transparent text-gray-500 hover:bg-orange-50'
                                            }`}
                                    >
                                        <span>Ahora mismo</span>
                                        {when === 'now' && <span>⚡</span>}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setWhen('tonight')}
                                        className={`py-4 px-4 rounded-xl font-bold text-left transition-all flex items-center justify-between ${when === 'tonight'
                                            ? 'bg-white border-2 border-mesa-orange text-mesa-orange shadow-sm'
                                            : 'bg-white border-2 border-transparent text-gray-500 hover:bg-orange-50'
                                            }`}
                                    >
                                        <span>Esta noche</span>
                                        {when === 'tonight' && <span>🌙</span>}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-mesa-text text-white font-bold py-5 rounded-xl shadow-lg hover:bg-gray-800 transform transition hover:scale-[1.02] text-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span>Buscando...</span>
                                ) : (
                                    <>
                                        <span>🔍</span> Buscar Mesa
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="animate-fade-in pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-mesa-text mb-6 flex items-center gap-2">
                            <CheckCircle className="text-green-500" />
                            Resultados Disponibles
                        </h2>

                        {results.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                <p className="text-gray-500 text-lg">No encontramos mesas disponibles para esta búsqueda.</p>
                                <p className="text-gray-400">Intenta con otro horario o número de personas.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.map(restaurant => (
                                    <div key={restaurant.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                        <div className="h-32 relative">
                                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                                <Star size={10} className="text-yellow-400 fill-yellow-400" /> {restaurant.rating}
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg text-mesa-text mb-1">{restaurant.name}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{restaurant.cuisine}</p>

                                            <div className="mt-auto">
                                                <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
                                                    <p className="text-xs font-bold text-green-700 mb-1">¡Mesa Disponible!</p>
                                                    <div className="flex items-center gap-2 text-green-600">
                                                        <Clock size={14} />
                                                        <span className="text-sm font-bold">Mesa #{restaurant.availableTable.table_number}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleQuickBook(restaurant.id)}
                                                    className="w-full py-3 bg-mesa-orange text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    Reservar Ahora <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-bold">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExpressReservation;
