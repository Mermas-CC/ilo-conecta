import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaFacebook, FaArrowLeft } from 'react-icons/fa';
import PageTransition from './PageTransition';
import apiService from '../services/apiService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiService.post('/auth/login', { email, password });

      login(data.user, data.token);
      navigate('/');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="bg-primary-500 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-white text-3xl font-bold">I</span>
            </Link>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            ¡Hola de nuevo!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa a Ilo Conecta para continuar tu aventura
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10 border border-gray-100">
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full flex items-center justify-center space-x-3 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
              >
                <FaGoogle className="text-red-500" />
                <span>Continuar con Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full flex items-center justify-center space-x-3 py-3 bg-blue-600 rounded-xl font-semibold text-white hover:bg-blue-700 transition shadow-sm"
              >
                <FaFacebook />
                <span>Continuar con Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">O usa tu correo</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                  placeholder="Correo electrónico"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                  placeholder="Contraseña"
                />
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Ingresar'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-6 text-gray-400">
            <Link to="/" className="flex items-center space-x-2 hover:text-primary-500 transition">
              <FaArrowLeft size={12} />
              <span className="text-xs font-bold uppercase tracking-widest">Volver Inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;
