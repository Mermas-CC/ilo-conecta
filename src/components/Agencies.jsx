import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSuitcase, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

export default function Agencies() {
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgencies();
    }, []);

    const fetchAgencies = async () => {
        try {
            const data = await apiService.get('/agencies');
            setAgencies(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching agencies:', error);
            setAgencies([]);
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
        <div className="min-h-screen bg-ilo-bg pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center space-x-3">
                    <Link to="/" className="text-gray-600 hover:text-primary-600">
                        <FaArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Agencias de Viaje</h1>
                </div>
            </header>

            <div className="max-w-screen-xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-6">
                    {agencies && agencies.length > 0 ? (
                        agencies.map((agency) => (
                            <div key={agency.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-2">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-48 h-40">
                                        <img
                                            src={agency.image}
                                            alt={agency.name}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    </div>
                                    <div className="flex-1 p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-gray-800">{agency.name}</h3>
                                            <div className="bg-primary-50 text-primary-600 p-2 rounded-xl">
                                                <FaSuitcase size={18} />
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-2 mb-4 leading-relaxed">
                                            {agency.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {agency.services.map((service, i) => (
                                                <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center text-gray-600 font-medium">
                                                <FaPhone className="mr-2 text-primary-500" size={12} />
                                                <span className="text-sm">{agency.phone}</span>
                                            </div>
                                            <button className="text-primary-600 text-sm font-bold flex items-center hover:underline">
                                                Contactar <FaExternalLinkAlt className="ml-1" size={10} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-gray-500">
                            No se encontraron agencias disponibles.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
