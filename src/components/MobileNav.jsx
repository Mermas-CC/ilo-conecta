import { NavLink } from 'react-router-dom';
import { FaHome, FaMapSigns, FaQrcode, FaUser, FaUmbrellaBeach } from 'react-icons/fa';

const MobileNav = () => {
    const navItems = [
        { name: 'Inicio', path: '/', icon: <FaHome size={22} /> },
        { name: 'Rutas', path: '/routes', icon: <FaMapSigns size={22} /> },
        { name: 'Lugares', path: '/attractions', icon: <FaUmbrellaBeach size={22} /> },
        { name: 'Scanner', path: '/qr-scanner', icon: <FaQrcode size={22} /> },
        { name: 'Perfil', path: '/profile', icon: <FaUser size={22} /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-2 z-50 flex justify-between items-center shadow-[0_-4px_24px_rgba(0,0,0,0.06)] safe-area-bottom rounded-t-[32px]">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all duration-300 w-16 ${isActive
                            ? 'text-primary-500 scale-110'
                            : 'text-gray-300 hover:text-gray-500'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <div className={`p-1 transition-all ${isActive ? 'text-primary-500' : ''}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.name}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
};

export default MobileNav;
