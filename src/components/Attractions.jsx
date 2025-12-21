import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaSearch, FaInfoCircle, FaCircle } from 'react-icons/fa';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

export default function Attractions() {
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['Todos', 'Playas', 'Naturaleza y Fauna', 'Espacios Culturales y Urbanos', 'Zonas Emblemáticas'];

    useEffect(() => {
        fetchAttractions();
    }, [selectedCategory]);

    const fetchAttractions = async () => {
        try {
            setLoading(true);
            let endpoint = '/attractions';
            if (selectedCategory !== 'Todos') {
                endpoint += `?category=${selectedCategory}`;
            }
            const data = await apiService.get(endpoint);
            setAttractions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching attractions:', error);
            setAttractions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAttractions = attractions.filter(attr =>
        (attr.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (attr.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const getWaveColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'tranquilo': return 'text-green-500';
            case 'precaución': return 'text-yellow-500';
            case 'peligroso': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    const getWaveBg = (status) => {
        switch (status?.toLowerCase()) {
            case 'tranquilo': return 'bg-green-100 text-green-700';
            case 'precaución': return 'bg-yellow-100 text-yellow-700';
            case 'peligroso': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-20">
                {/* Header */}
                <header className="bg-white sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-primary-600">
                            <FaArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Lugares</h1>
                    </div>
                </header>

                <div className="px-6 py-6">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Buscar en Ilo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary-400 transition-all font-medium text-gray-700"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    {/* Wave Semaphore Legend - Only visible if Todos or Playas selected */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Playas') && (
                        <>
                            {/* Danger Alert Banner */}
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-pulse">
                                <div className="bg-red-500 p-2 rounded-full text-white">
                                    <FaCircle size={12} className="animate-ping" />
                                </div>
                                <div>
                                    <h4 className="text-red-800 font-black text-sm uppercase tracking-tight">¡Alerta de Oleaje!</h4>
                                    <p className="text-red-600 text-xs font-bold">Bandera Roja en Puerto Inglés. Evite ingresar al mar.</p>
                                </div>
                            </div>

                            <div className="mb-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                                    <FaInfoCircle className="text-primary-500" />
                                    <h3>Semáforo de oleaje</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl">
                                        <FaCircle className="text-green-500" size={12} />
                                        <span className="text-sm font-bold text-green-700">Verde: Seguro para nadar</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-2xl">
                                        <FaCircle className="text-yellow-500" size={12} />
                                        <span className="text-sm font-bold text-yellow-700">Amarillo: Precaución</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl">
                                        <FaCircle className="text-red-500" size={12} />
                                        <span className="text-sm font-bold text-red-700">Rojo: Peligroso</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Categories */}
                    <div className="flex space-x-3 overflow-x-auto pb-6 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm border border-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Attractions Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredAttractions.map((attr) => (
                                <Link
                                    key={attr.id}
                                    to={`/attractions/${attr.id}`}
                                    className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={attr.image}
                                            alt={attr.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary-600 uppercase shadow-sm">
                                                {attr.category}
                                            </div>
                                            {attr.category === 'Playas' && (
                                                <div className={`${getWaveBg(attr.wavestatus || (
                                                    attr.name === 'Playa Boca del Río' ? 'Tranquilo' :
                                                        attr.name === 'Playa Wawakiki' ? 'Precaución' :
                                                            attr.name === 'Puerto Inglés' ? 'Peligroso' :
                                                                attr.name === 'Playa Pozo Lisas' ? 'Tranquilo' :
                                                                    attr.name === 'Playa Las Tres Hermanas' ? 'Tranquilo' : 'Tranquilo'
                                                ))} backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm flex items-center gap-1`}>
                                                    <FaCircle size={8} className={getWaveColor(attr.wavestatus || (
                                                        attr.name === 'Playa Boca del Río' ? 'Tranquilo' :
                                                            attr.name === 'Playa Wawakiki' ? 'Precaución' :
                                                                attr.name === 'Puerto Inglés' ? 'Peligroso' :
                                                                    attr.name === 'Playa Pozo Lisas' ? 'Tranquilo' :
                                                                        attr.name === 'Playa Las Tres Hermanas' ? 'Tranquilo' : 'Tranquilo'
                                                    ))} />
                                                    {attr.wavestatus || (
                                                        attr.name === 'Playa Boca del Río' ? 'Tranquilo' :
                                                            attr.name === 'Playa Wawakiki' ? 'Precaución' :
                                                                attr.name === 'Puerto Inglés' ? 'Peligroso' :
                                                                    attr.name === 'Playa Pozo Lisas' ? 'Tranquilo' :
                                                                        attr.name === 'Playa Las Tres Hermanas' ? 'Tranquilo' : 'Tranquilo'
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{attr.name}</h3>
                                        <div className="flex items-center text-xs text-gray-500 mb-3">
                                            <FaMapMarkerAlt className="mr-1 text-primary-400" />
                                            {attr.location}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{attr.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && filteredAttractions.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 font-medium">No se encontraron lugares en esta categoría.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
