import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaQrcode, FaCamera, FaTimes, FaSearch, FaStop } from 'react-icons/fa';
import { Html5Qrcode } from 'html5-qrcode';
import PageTransition from './PageTransition';

export default function QRScanner() {
    const [isScanning, setIsScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [error, setError] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const scannerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        setError(null);
        setIsScanning(true);

        try {
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    // Success!
                    handleScanResult(decodedText);
                },
                (errorMessage) => {
                    // This is called for every frame where NO QR is found, so we keep it quiet
                }
            );
            setIsCameraReady(true);
        } catch (err) {
            console.error("Error starting scanner:", err);
            setError("No se pudo acceder a la cámara. Verifica los permisos.");
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
        setIsScanning(false);
        setIsCameraReady(false);
    };

    const handleScanResult = async (code) => {
        if (!code) return;

        // Stop camera immediately upon finding a code
        await stopScanner();

        setIsScanning(true); // Show loader during validation

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/attractions/qr/${code}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Código no reconocido');
            }

            // Redirect to the attraction detail
            navigate(`/attractions/${data.id}`);
        } catch (err) {
            setError(err.message);
            setIsScanning(false);
        }
    };

    const handleManualSearch = () => {
        if (manualCode) {
            handleScanResult(manualCode);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-20">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                            <FaArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Escáner IloConecta</h1>
                    </div>
                </header>

                <div className="max-w-md mx-auto px-6 py-8">
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 overflow-hidden relative">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary-50 rounded-full blur-3xl opacity-60"></div>

                        <div className="relative z-10 text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-500 rounded-3xl mb-6 shadow-inner">
                                <FaQrcode size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Entrada Digital</h2>
                            <p className="text-gray-500 text-sm leading-relaxed px-4">
                                Escanea el código QR del monumento o atractivo para conocer su historia y registrar tu visita.
                            </p>
                        </div>

                        {/* Camera Box */}
                        <div className="relative bg-black rounded-[32px] overflow-hidden mb-10 border-4 border-gray-100 shadow-inner group" style={{ aspectRatio: '1/1' }}>
                            <div id="reader" className="w-full h-full"></div>

                            {!isScanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                                    <div className="w-56 h-56 border-2 border-gray-200 rounded-[40px] relative flex items-center justify-center">
                                        <FaCamera size={56} className="text-gray-200" />
                                        {/* Viewfinder Corners */}
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 -m-[2px] rounded-tl-2xl"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 -m-[2px] rounded-tr-2xl"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 -m-[2px] rounded-bl-2xl"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 -m-[2px] rounded-br-2xl"></div>
                                    </div>
                                    <button
                                        onClick={startScanner}
                                        className="mt-8 bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 hover:scale-105 transition-transform"
                                    >
                                        Activar Cámara
                                    </button>
                                </div>
                            )}

                            {isScanning && !isCameraReady && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-sm z-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                                    <p className="text-white font-bold mt-4 text-sm tracking-widest uppercase">Validando...</p>
                                </div>
                            )}

                            {isCameraReady && (
                                <button
                                    onClick={stopScanner}
                                    className="absolute bottom-4 right-4 bg-red-500/80 backdrop-blur-md text-white p-4 rounded-2xl z-30 shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <FaStop />
                                </button>
                            )}
                        </div>

                        {/* Error Handling */}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center animate-fade-in text-center justify-center">
                                <FaTimes className="mr-3 flex-shrink-0" />
                                <span className="text-xs font-bold">{error}</span>
                            </div>
                        )}

                        {/* Manual entry */}
                        <div className="space-y-4">
                            {!isScanning && (
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Ingresar código manualmente..."
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                        className="w-full pl-6 pr-14 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-200 focus:bg-white transition-all text-sm font-bold tracking-widest placeholder:text-gray-400 placeholder:font-medium placeholder:tracking-normal outline-none"
                                    />
                                    <button
                                        onClick={handleManualSearch}
                                        className="absolute right-2 top-2 bottom-2 w-10 bg-primary-500 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors shadow-sm"
                                    >
                                        <FaSearch size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-10 px-4">
                        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-center">Instrucciones</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 border border-white/80 p-4 rounded-3xl">
                                <div className="text-primary-500 font-bold text-lg mb-1">01</div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Activa la cámara o ingresa el código</p>
                            </div>
                            <div className="bg-white/50 border border-white/80 p-4 rounded-3xl">
                                <div className="text-primary-500 font-bold text-lg mb-1">02</div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Apunta al código QR físico</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
