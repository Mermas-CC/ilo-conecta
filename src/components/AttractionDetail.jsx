import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaQrcode, FaChevronRight } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

export default function AttractionDetail() {
    const { id } = useParams();
    const [attraction, setAttraction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAttractionDetail();
    }, [id]);

    const fetchAttractionDetail = async () => {
        try {
            const data = await apiService.get(`/attractions/${id}`);
            setAttraction(data);
        } catch (error) {
            console.error('Error fetching attraction detail:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-ilo-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!attraction) {
        return (
            <div className="min-h-screen bg-ilo-bg p-6 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Atractivo no encontrado</h2>
                <Link to="/attractions" className="text-primary-600 font-bold">Volver al listado</Link>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-24">
                {/* Transparent Header Over Image */}
                <header className="fixed top-0 inset-x-0 z-40 p-6 flex items-center justify-between pointer-events-none">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-800 shadow-lg pointer-events-auto"
                    >
                        <FaArrowLeft />
                    </button>
                </header>

                {/* Hero Image */}
                <div className="relative h-[45vh] w-full">
                    <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ilo-bg via-transparent to-black/20"></div>

                    <div className="absolute bottom-0 inset-x-0 p-8">
                        <span className="px-3 py-1 bg-primary-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                            {attraction.category}
                        </span>
                        <h1 className="text-3xl font-extrabold text-gray-900 mt-2 leading-tight">
                            {attraction.name}
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 -mt-2 relative z-10 space-y-6">
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 -mt-4">
                        <div className="flex items-center space-x-6 mb-8 py-2 overflow-x-auto no-scrollbar">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-1">
                                    <FaMapMarkerAlt />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Ubicación</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-1">
                                    <FaClock />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Horario</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-1">
                                    <span className="font-bold text-lg">$</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{attraction.isFree ? 'Gratis' : 'Pago'}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800">Sobre este lugar</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {attraction.description}
                            </p>
                        </div>

                        <hr className="my-8 border-gray-50" />

                        <div className="space-y-4">
                            <div className="flex items-center text-sm">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 text-primary-500">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{attraction.location}</p>
                                    <p className="text-gray-400 text-xs">Ilo, Moquegua</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 text-primary-500">
                                    <FaClock />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{attraction.openingHours}</p>
                                    <p className="text-gray-400 text-xs">Abierto hoy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section (For testing scanner) */}
                    <div className="bg-gradient-to-br from-primary-500 to-cyan-500 rounded-[40px] p-8 text-white shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h3 className="text-xl font-bold mb-2">Código QR de Visita</h3>
                            <p className="text-white/80 text-xs mb-6 max-w-[200px]">
                                Escanea este código o ingrésalo en el escáner para registrar tu visita.
                            </p>

                            <div className="bg-white p-4 rounded-3xl shadow-lg mb-4">
                                <QRCodeSVG value={attraction.qrcode} size={150} />
                            </div>

                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 font-mono text-lg font-bold">
                                {attraction.qrcode}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
