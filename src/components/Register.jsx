import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaFacebook, FaSuitcase, FaHome, FaUtensils, FaTree, FaUmbrellaBeach, FaPaintBrush, FaHiking, FaSpa } from 'react-icons/fa';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

const interestOptions = [
  { id: 'gastronomia', label: 'Gastronomía', icon: FaUtensils },
  { id: 'natura', label: 'Natura', icon: FaTree },
  { id: 'oet', label: 'Oet AK8', icon: FaUmbrellaBeach },
  { id: 'cultura', label: 'Cultura', icon: FaPaintBrush },
  { id: 'aventura', label: 'Aventura', icon: FaHiking },
  { id: 'relax', label: 'Relax', icon: FaSpa },
];

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTourist, setIsTourist] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await apiService.post('/auth/register', {
        name,
        email,
        password,
        isTourist,
        interests: selectedInterests
      });

      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Login con ${provider} - Funcionalidad en desarrollo`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Ilo Conecta"
                className="w-12 h-12"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-10 h-10"><text x="50" y="60" font-size="50" fill="white" text-anchor="middle">🏖️</text></svg>';
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Únete a Ilo Conecta
          </h1>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-sm"
            >
              <FaGoogle />
              <span>Continuar con Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition shadow-sm"
            >
              <FaFacebook />
              <span>Continuar Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">O regístrate con tu correo</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
                placeholder="Nombre Completo"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
                placeholder="Correo Electrónico"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
                placeholder="Contraseña"
              />
            </div>

            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
                placeholder="Confirmar Contraseña"
              />
            </div>

            {/* Tourist Toggle */}
            <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <FaSuitcase className="text-primary-600" />
                <span className="text-gray-700 font-medium">¿Eres turista o ciudadano?</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTourist(!isTourist)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isTourist ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTourist ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>

            {/* Interests Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Selecctas tus intereses</h3>
                <button
                  type="button"
                  onClick={() => setIsTourist(!isTourist)}
                  className={`text-xs px-3 py-1 rounded-full ${isTourist ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  {isTourist ? '¿turista' : 'ciudadano'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">(Para rutas personalizadas!)</p>

              <div className="grid grid-cols-3 gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex flex-col items-center py-3 px-2 rounded-lg border-2 transition ${selectedInterests.includes(interest.id)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    <interest.icon size={20} className="mb-1" />
                    <span className="text-xs font-medium">{interest.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear mi Cuenta'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-sm text-center text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>

          {/* Footer Icons */}
          <div className="flex justify-center space-x-6 mt-8">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <span className="text-xl">?</span>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <span className="text-xl">🛡️</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Register;
