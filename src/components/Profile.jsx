import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaChevronRight, FaQrcode, FaSignOutAlt, FaShieldAlt, FaQuestionCircle, FaUmbrellaBeach } from 'react-icons/fa';
import PageTransition from './PageTransition';
import { QRCodeSVG } from 'qrcode.react';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const nextTrip = {
        destination: "Glorieta José Gálvez",
        date: "15 Nov",
        time: "4:00 PM",
        image: "https://images.unsplash.com/photo-1533093818801-90dd2b6e0a00?w=600",
        qr: "GLORIETA-QR-123"
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-24">
                {/* Header - User Info */}
                <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm mb-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                            <FaUser size={40} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{user?.name || 'Viajero'}</h1>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            <div className="mt-2 inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase transition">
                                Turista Verificado
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-6 space-y-6">
                    {/* Featured Itinerary Item with QR */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-800">Próximo Destino</h3>
                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">HOY</span>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden h-48 mb-6">
                            <img src={nextTrip.image} alt={nextTrip.destination} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end justify-between">
                                <div>
                                    <h4 className="text-white font-bold text-lg">{nextTrip.destination}</h4>
                                    <p className="text-white/80 text-xs">Punto de interés histórico</p>
                                </div>
                                <div className="bg-white p-2 rounded-lg shadow-lg">
                                    <QRCodeSVG value={nextTrip.qr} size={50} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 italic">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Nota del viajero</p>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                "No olvidar visitar el muelle histórico al atardecer para las mejores fotos de la bahía."
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <Link to="/attractions" className="flex items-center justify-between p-5 border-b border-gray-50 hover:bg-gray-50 transition">
                            <div className="flex items-center space-x-4">
                                <div className="bg-primary-50 p-3 rounded-xl text-primary-500"><FaUmbrellaBeach /></div>
                                <span className="font-bold text-gray-700">Explorar Atractivos</span>
                            </div>
                            <FaChevronRight size={14} className="text-gray-300" />
                        </Link>
                        <button
                            onClick={() => navigate('/qr-scanner')}
                            className="w-full flex items-center justify-between p-5 border-b border-gray-50 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-cyan-50 p-3 rounded-xl text-cyan-500"><FaQrcode /></div>
                                <span className="font-bold text-gray-700">Escáner de Turismo</span>
                            </div>
                            <FaChevronRight size={14} className="text-gray-300" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-5 text-red-500 hover:bg-red-50 transition"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-red-50 p-3 rounded-xl text-red-500"><FaSignOutAlt /></div>
                                <span className="font-bold">Cerrar Sesión</span>
                            </div>
                        </button>
                    </div>

                    {/* Help & Safety Button */}
                    <div className="flex gap-4">
                        <Link to="/safety" className="flex-1 flex items-center justify-center space-x-2 h-14 bg-primary-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition">
                            <span>Consejos y Seguridad</span>
                            <FaShieldAlt />
                        </Link>
                    </div>

                    {/* Footer help icons */}
                    <div className="flex justify-center space-x-8 pt-4 opacity-40">
                        <FaQuestionCircle size={24} />
                        <FaShieldAlt size={24} />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
