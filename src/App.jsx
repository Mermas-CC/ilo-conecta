import { Routes, Route, useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './components/Home';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import ReservationsList from './components/ReservationsList';
import Hotels from './components/Hotels';
import Events from './components/Events';
import RoutesPage from './components/Routes';
import RouteDetail from './components/RouteDetail';
import QRScanner from './components/QRScanner';
import Attractions from './components/Attractions';
import AttractionDetail from './components/AttractionDetail';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Agencies from './components/Agencies';
import PrivateRoute from './components/PrivateRoute';
import MobileNav from './components/MobileNav';

function Layout() {
  return (
    <div className="min-h-screen bg-ilo-bg">
      <main className="pb-20">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}

function RestaurantDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <RestaurantDetail restaurantId={id} onBack={() => navigate('/restaurants')} />;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetailWrapper />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<Events />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/routes/:id" element={<RouteDetail />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/reservations" element={
          <PrivateRoute>
            <ReservationsList />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        {/* Attractions */}
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/attractions/:id" element={<AttractionDetail />} />
        <Route path="/safety" element={
          <div className="min-h-screen bg-ilo-bg p-6">
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Seguridad</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">🛡️ Usa bloqueador solar</li>
                <li className="flex items-center gap-3">🛡️ Bebe agua embotellada</li>
                <li className="flex items-center gap-3">🛡️ Cuida tus pertenencias</li>
              </ul>
            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;
