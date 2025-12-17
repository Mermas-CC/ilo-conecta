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
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-mesa-orange mb-2">¡Bienvenido a Mesa Libre!</h1>
          <p className="text-gray-600">Ingresa para gestionar tus reservaciones</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-mesa-orange focus:border-transparent transition-all"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-mesa-orange focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm font-medium text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-white bg-mesa-orange rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar con Correo'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/0 text-gray-500 font-medium">O continúa con</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">G</span> Ingresar con Google
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-bold text-mesa-orange hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
