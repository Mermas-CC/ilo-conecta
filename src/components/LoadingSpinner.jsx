const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
                {/* Outer spinning ring */}
                <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-mesa-orange border-t-transparent rounded-full animate-spin"></div>

                {/* Logo in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/logo.png" alt="Mesa Libre" className="h-10 w-auto opacity-60" />
                </div>
            </div>

            <p className="mt-6 text-gray-600 font-medium animate-pulse">Cargando...</p>
        </div>
    );
};

export default LoadingSpinner;
