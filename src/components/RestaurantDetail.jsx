import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useAuth } from '../context/AuthContext';
import TableLayout from './TableLayout'; // Import TableLayout
import { QRCodeSVG } from 'qrcode.react'; // Import QRCode

function RestaurantDetail({ restaurantId, onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const { token, user } = useAuth();

  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [country, setCountry] = useState(''); // New state for country
  const [specialRequests, setSpecialRequests] = useState(''); // New state for special requests
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [notification, setNotification] = useState(null); // { message, type: 'success' | 'error' }

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Timer State
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    let timer;
    if (selectedTable && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setSelectedTable(null);
      showNotification("¡El tiempo de reserva ha expirado! Por favor selecciona la mesa nuevamente.", 'error');
      setTimeLeft(600); // Reset for next time
    }

    return () => clearInterval(timer);
  }, [selectedTable, timeLeft]);

  // Reset timer when a new table is selected
  useEffect(() => {
    if (selectedTable) {
      setTimeLeft(600);
    }
  }, [selectedTable]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error('Error al cargar restaurante');
      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const performAvailabilityCheck = useCallback(async () => {
    if (!date || !time || !guests || !restaurantId) {
      return; // Do not proceed if inputs are not complete
    }

    setCheckingAvailability(true);
    setSelectedTable(null);
    setAvailableTables([]);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/restaurants/${restaurantId}/availability?date=${date}&time=${time}&guests=${guests}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al verificar disponibilidad');
      }
      const data = await response.json();
      setAvailableTables(data.availableTables);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingAvailability(false);
    }
  }, [date, time, guests, restaurantId]); // Dependencies for useCallback

  useEffect(() => {
    const handler = setTimeout(() => {
      if (date && time && guests && restaurant) { // Ensure restaurant is also loaded
        performAvailabilityCheck();
      }
    }, 500); // Debounce for 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [date, time, guests, restaurant, performAvailabilityCheck]); // Add restaurant to dependencies

  const checkAvailability = (e) => {
    e.preventDefault(); // Prevent form submission if triggered by button
    performAvailabilityCheck();
  };

  const makeReservation = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      showNotification('Por favor selecciona una mesa', 'error');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurantId: parseInt(restaurantId),
          tableId: selectedTable.id,
          date,
          time,
          guests: parseInt(guests),
          customerPhone,
          country, // New field
          specialRequests // New field
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear reservación');
      }

      setReservationSuccess(true);
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  if (loading) return <div className="text-center py-12 text-xl">Cargando...</div>;
  if (error) return <div className="text-center py-12 text-xl text-red-600">Error: {error}</div>;
  if (!restaurant) return <div className="text-center py-12 text-xl text-red-600">Restaurante no encontrado</div>;

  if (reservationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* Left Side: QR Code Area */}
          <div className="bg-mesa-bg p-8 flex flex-col items-center justify-center border-r border-dashed border-gray-200 relative md:w-1/3">
            <div className="absolute -right-3 top-0 bottom-0 w-6 flex flex-col justify-between py-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white"></div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <QRCodeSVG
                value={JSON.stringify({
                  restaurant: restaurant.name,
                  table: selectedTable?.tableNumber,
                  date: date,
                  time: time,
                  guests: guests,
                  user: user?.name
                })}
                size={160}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Escanea al llegar</p>
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 p-8 md:p-12 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <span className="text-xl">✓</span>
                </div>
                <h2 className="text-3xl font-bold text-mesa-text">¡Reservación Confirmada!</h2>
              </div>
              <p className="text-gray-500 pl-14">Tu mesa está lista. Te hemos enviado un correo con los detalles.</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 pl-4 border-l-4 border-mesa-orange">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Restaurante</p>
                <p className="font-bold text-xl text-gray-800">{restaurant.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mesa</p>
                <p className="font-bold text-xl text-gray-800">#{selectedTable?.tableNumber}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fecha</p>
                <p className="font-bold text-xl text-gray-800 capitalize">
                  {new Date(date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Hora</p>
                <p className="font-bold text-xl text-gray-800">{time}</p>
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={onBack}
                className="w-full px-6 py-4 bg-mesa-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-200"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in-down ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          <span className="text-xl">{notification.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="font-bold">{notification.message}</span>
        </div>
      )}
      {/* Left Column: Table Selection & Form */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-8 border border-mesa-sidebar overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-mesa-text">Vista Restaurante</h2>
          <button onClick={onBack} className="text-gray-400 hover:text-mesa-text">✕</button>
        </div>

        {/* Interactive Selection Form */}
        <div className="mb-8 bg-mesa-bg p-6 rounded-2xl space-y-6">

          {/* Date Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Fecha</label>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {Array.from({ length: 14 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];
                const isSelected = date === dateStr;

                const dayName = d.toLocaleDateString('es-MX', { weekday: 'short' });
                const dayNumber = d.getDate();
                const monthName = d.toLocaleDateString('es-MX', { month: 'short' });

                return (
                  <button
                    key={i}
                    onClick={() => setDate(dateStr)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border-2 transition-all duration-200 ${isSelected
                      ? 'bg-mesa-orange border-mesa-orange text-white shadow-lg scale-105'
                      : 'bg-white border-transparent text-gray-500 hover:border-mesa-orange/50'
                      }`}
                  >
                    <span className="text-xs font-bold uppercase">{i === 0 ? 'HOY' : dayName}</span>
                    <span className="text-xl font-bold">{dayNumber}</span>
                    <span className="text-[10px] uppercase">{monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Hora</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`py-2 px-1 rounded-xl text-sm font-bold transition-all ${time === t
                    ? 'bg-mesa-orange text-white shadow-md scale-105'
                    : 'bg-white text-gray-600 hover:bg-orange-50'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Personas</label>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setGuests(n)}
                  className={`flex-shrink-0 w-12 h-12 rounded-full font-bold text-lg transition-all flex items-center justify-center ${guests === n
                    ? 'bg-mesa-text text-white shadow-lg scale-110'
                    : 'bg-white text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={checkAvailability}
            disabled={checkingAvailability || !date || !time}
            className="w-full bg-mesa-orange hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg transform active:scale-95 mt-4"
          >
            {checkingAvailability ? 'Buscando Mesas...' : 'Verificar Disponibilidad'}
          </button>
        </div>

        {/* Table Grid */}
        <div className="relative w-full min-h-[300px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
          {checkingAvailability ? (
            <p className="text-gray-400 animate-pulse">Buscando mesas...</p>
          ) : availableTables.length > 0 && restaurant ? (
            <TableLayout
              allTables={restaurant.tables || []}
              availableTables={availableTables}
              selectedTable={selectedTable}
              onSelectTable={setSelectedTable}
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-400 mb-2">Selecciona fecha y hora para ver mesas</p>
              <span className="text-4xl opacity-20">🍽️</span>
            </div>
          )}
        </div>

        {selectedTable && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center mb-6">
              <h3 className="text-2xl font-bold text-mesa-orange mb-2">¡Asegura tu Mesa {selectedTable.tableNumber}!</h3>
              <p className="text-gray-600 mb-4">¡La mesa es tuya!</p>

              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-mesa-orange border-t-transparent animate-spin-slow" style={{ animationDuration: '10s' }}></div>
                <span className="text-3xl font-bold text-gray-800">{formatTime(timeLeft)}</span>
              </div>

              <p className="text-sm text-gray-500 mt-4">Tienes 10 minutos para completar la reserva</p>
            </div>

            <button
              onClick={makeReservation}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] text-lg"
            >
              RESERVAR AHORA
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Restaurant Info */}
      <div className="w-full lg:w-96 bg-white rounded-3xl shadow-lg p-6 border border-mesa-sidebar h-fit overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-mesa-text">{restaurant.name}</h1>
            <div className="flex text-yellow-400 text-sm">
              {'⭐'.repeat(Math.round(restaurant.rating))}
            </div>
          </div>
          <div className="bg-mesa-orange text-white px-2 py-1 rounded text-xs font-bold">
            Mesa Libre
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <img src={restaurant.image} alt="Interior" className="rounded-xl w-full h-32 object-cover col-span-2" />
          {/* Placeholders for more images if available, or just reuse */}
          <div className="bg-gray-100 rounded-xl h-24 flex items-center justify-center text-gray-400">Foto 2</div>
          <div className="bg-gray-100 rounded-xl h-24 flex items-center justify-center text-gray-400">Foto 3</div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-mesa-text mb-1">Descripción</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{restaurant.description}</p>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="bg-orange-100 p-2 rounded-full text-orange-500">📍</span>
            <span>{restaurant.address}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="bg-blue-100 p-2 rounded-full text-blue-500">🕐</span>
            <span>{restaurant.openingHours}</span>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <p className="text-xs font-bold text-mesa-text">Torpons loldies</p>
                <p className="text-[10px] text-gray-400">Hace 2 días</p>
              </div>
              <span className="ml-auto text-yellow-400 text-xs">★★★★☆</span>
            </div>
            <p className="text-xs text-gray-500 italic">"Excelente servicio y comida deliciosa."</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;
