import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaFilter, FaSearch } from 'react-icons/fa';
import PageTransition from './PageTransition';

export default function Attractions() {
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['Todos', 'Histórico', 'Natural', 'Religioso', 'Cultura'];

    useEffect(() => {
        fetchAttractions();
    }, [selectedCategory]);

    const fetchAttractions = async () => {
        try {
            setLoading(true);
            const baseUrl = `http://${window.location.hostname}:3001`;
            let url = `${baseUrl}/api/attractions`;
            if (selectedCategory !== 'Todos') {
                url += `?category=${selectedCategory}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setAttractions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching attractions:', error);
            setAttractions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAttractions = attractions.filter(attr =>
        attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-20">
                {/* Header */}
                <header className="bg-white sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-primary-600">
                            <FaArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Atractivos Turísticos</h1>
                    </div>
                </header>

                <div className="px-6 py-6">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Buscar lugares..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary-400 transition-all font-medium text-gray-700"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>

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
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary-600 uppercase">
                                            {attr.category}
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
