import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Get isAuthenticated

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to homepage if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

      <div className="relative z-10 w-full max-w-md p-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Mesa Libre" className="h-20 w-auto drop-shadow-lg" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mesa-text mb-2">¡Bienvenido de nuevo!</h1>
          <p className="text-gray-600">Ingresa para gestionar tus reservaciones</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-mesa-orange focus:border-transparent transition-all placeholder:text-gray-400"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-mesa-orange focus:border-transparent transition-all placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-white bg-gradient-to-r from-mesa-orange to-orange-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">O continúa con</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3.5 font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Ingresar con Google
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-bold text-mesa-orange hover:text-orange-600 hover:underline transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
