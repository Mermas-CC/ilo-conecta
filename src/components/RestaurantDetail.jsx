import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import TableLayout from './TableLayout';
import { QRCodeSVG } from 'qrcode.react';
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUsers, FaChevronLeft } from 'react-icons/fa';
import PageTransition from './PageTransition';
import { useNavigate } from 'react-router-dom';

function RestaurantDetail({ restaurantId, onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [country, setCountry] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  const [timeLeft, setTimeLeft] = useState(600);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    let timer;
    if (selectedTable && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setSelectedTable(null);
      showNotification("¡El tiempo ha expirado!", 'error');
      setTimeLeft(600);
    }
    return () => clearInterval(timer);
  }, [selectedTable, timeLeft]);

  const formatTimeMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/restaurants/${restaurantId}`);
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
    if (!date || !time || !guests || !restaurantId) return;

    setCheckingAvailability(true);
    setSelectedTable(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/restaurants/${restaurantId}/availability?date=${date}&time=${time}&guests=${guests}`
      );
      if (!response.ok) throw new Error('Error al verificar disponibilidad');
      const data = await response.json();
      setAvailableTables(data.availableTables);
    } catch (err) {
      showNotification(err.message);
    } finally {
      setCheckingAvailability(false);
    }
  }, [date, time, guests, restaurantId]);

  useEffect(() => {
    if (date && time && guests && restaurant) {
      performAvailabilityCheck();
    }
  }, [date, time, guests, restaurant, performAvailabilityCheck]);

  const makeReservation = async () => {
    if (!selectedTable) return;

    try {
      const response = await fetch(`http://localhost:3001/api/reservations`, {
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
          country,
          specialRequests
        })
      });

      if (!response.ok) throw new Error('Error al crear reservación');
      setReservationSuccess(true);
    } catch (err) {
      showNotification(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );

  if (reservationSuccess) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-ilo-bg p-6 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-sm w-full">
            <div className="bg-primary-500 p-8 flex justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <QRCodeSVG
                  value={JSON.stringify({
                    res: restaurant.name,
                    t: selectedTable?.tableNumber,
                    dt: date,
                    tm: time
                  })}
                  size={180}
                />
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Lista!</h2>
              <p className="text-gray-500 mb-6">Mesa #{selectedTable?.tableNumber} confirmada</p>
              <button
                onClick={() => navigate('/restaurants')}
                className="w-full bg-primary-500 text-white font-bold py-4 rounded-full shadow-lg"
              >
                Volver al Listado
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-ilo-bg pb-24">
        {/* Header */}
        <div className="relative h-72">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 top-0 p-4 flex justify-between">
            <button onClick={onBack} className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md text-gray-800">
              <FaChevronLeft size={20} />
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1 text-sm font-bold">
              <FaStar className="text-yellow-400" /> {restaurant.rating}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-primary-100 flex items-center gap-2 mt-1">
              <FaMapMarkerAlt size={14} /> {restaurant.location || restaurant.address}
            </p>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-500" /> Planifica tu Visita
                </h2>

                <div className="space-y-6">
                  {/* Date Selector */}
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase mb-3 block tracking-wide">Fecha</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const dateStr = d.toISOString().split('T')[0];
                        const isSelected = date === dateStr;
                        return (
                          <button
                            key={i}
                            onClick={() => setDate(dateStr)}
                            className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                              }`}
                          >
                            <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                            <span className="text-2xl font-bold my-1">{d.getDate()}</span>
                            <span className="text-[10px] uppercase">{d.toLocaleDateString('es-ES', { month: 'short' })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase mb-3 block tracking-wide">Hora</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-400 font-semibold"
                      >
                        <option value="">Seleccionar hora</option>
                        {['12:00', '13:00', '14:00', '19:00', '20:00', '21:00'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase mb-3 block tracking-wide">Personas</label>
                      <div className="flex items-center bg-gray-50 rounded-xl p-1">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-10 h-10 flex items-center justify-center font-bold text-primary-600"
                        >-</button>
                        <span className="flex-1 text-center font-bold">{guests}</span>
                        <button
                          onClick={() => setGuests(guests + 1)}
                          className="w-10 h-10 flex items-center justify-center font-bold text-primary-600"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Selection Area */}
              {(date && time) && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaUsers className="text-primary-500" /> Elige tu Mesa
                  </h2>
                  <div className="bg-gray-50 rounded-2xl min-h-[300px] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-100">
                    {checkingAvailability ? (
                      <div className="animate-pulse text-gray-400">Verificando...</div>
                    ) : (
                      <TableLayout
                        allTables={restaurant.tables}
                        availableTables={availableTables}
                        selectedTable={selectedTable}
                        onSelectTable={setSelectedTable}
                      />
                    )}
                  </div>

                  {selectedTable && (
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Mesa Seleccionada</p>
                        <p className="text-2xl font-bold text-gray-800">Mesa #{selectedTable.tableNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tiempo Límite</p>
                        <p className="text-2xl font-bold text-primary-600">{formatTimeMinutes(timeLeft)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Side Info Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Detalles del Lugar</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{restaurant.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="bg-primary-50 p-3 rounded-full text-primary-500"><FaClock size={16} /></div>
                    <div>
                      <p className="font-bold text-gray-700">Horario</p>
                      <p className="text-gray-500">{restaurant.openingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="bg-primary-50 p-3 rounded-full text-primary-500"><FaMapMarkerAlt size={16} /></div>
                    <div>
                      <p className="font-bold text-gray-700">Ubicación</p>
                      <p className="text-gray-500">{restaurant.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTable && (
                <button
                  onClick={makeReservation}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-5 rounded-3xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 text-lg"
                >
                  RESERVAR AHORA
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default RestaurantDetail;
