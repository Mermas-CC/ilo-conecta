import { Routes, Route, Link, useNavigate, Outlet, useParams, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import ReservationsList from './components/ReservationsList';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Experience from './components/Experience';
import ExpressReservation from './components/ExpressReservation';

import MobileNav from './components/MobileNav';

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-mesa-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-mesa-bg pb-20 md:pb-0">
        {/* Header */}
        <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-end gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 border-b border-gray-100/50">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-mesa-orange/10 flex items-center justify-center text-mesa-orange font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-600 font-medium text-sm hidden md:inline">Hola, {user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-mesa-orange text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
            >
              Ingresar
            </Link>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

function RestaurantDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <RestaurantDetail restaurantId={id} onBack={() => navigate('/')} />;
}

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <RestaurantList onSelectRestaurant={(id) => navigate(`/restaurants/${id}`)} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="restaurants/:id" element={
          <PrivateRoute>
            <RestaurantDetailWrapper />
          </PrivateRoute>
        } />
        <Route path="reservations" element={
          <PrivateRoute>
            <ReservationsList onBack={() => navigate('/')} />
          </PrivateRoute>
        } />
        <Route path="experience" element={<Experience />} />
        <Route path="express" element={<ExpressReservation />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;

