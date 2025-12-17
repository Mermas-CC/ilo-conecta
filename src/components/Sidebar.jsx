import { NavLink } from 'react-router-dom';
import { Map, Store, Clock, CheckCircle, Star, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Mapa de Restaurantes', path: '/', icon: <Map size={20} /> },
        { name: 'Reserva Express', path: '/express', icon: <Clock size={20} /> },
        { name: 'Confirmación', path: '/reservations', icon: <CheckCircle size={20} /> },
        { name: 'Experiencia Final', path: '/experience', icon: <Star size={20} /> },
    ];

    return (
        <aside className="hidden md:flex w-72 bg-white min-h-screen p-8 flex-col border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 sticky top-0 h-screen overflow-y-auto">
            {/* Logo Area */}
            <div className="mb-12 flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-mesa-orange rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-orange-200 shadow-lg">
                    M
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Mesa Libre</h1>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">RESERVATIONS</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-orange-50 text-mesa-orange font-bold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`text-xl transition-transform duration-300 group-hover:scale-110`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm tracking-wide">{item.name}</span>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mesa-orange" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-8 border-t border-gray-100 px-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Settings size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-700">Configuración</p>
                        <p className="text-[10px] text-gray-400">v1.0.2</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
