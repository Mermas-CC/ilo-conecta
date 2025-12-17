import { NavLink } from 'react-router-dom';
import { Map, Store, Clock, CheckCircle, Star } from 'lucide-react';

const MobileNav = () => {
    const navItems = [
        { name: 'Mapa', path: '/', icon: <Map size={20} /> },
        { name: 'Express', path: '/express', icon: <Clock size={20} /> },
        { name: 'Reservas', path: '/reservations', icon: <CheckCircle size={20} /> },
        { name: 'Exp', path: '/experience', icon: <Star size={20} /> },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-colors ${isActive
                            ? 'text-mesa-orange'
                            : 'text-gray-400 hover:text-gray-600'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-orange-50' : ''}`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
};

export default MobileNav;
