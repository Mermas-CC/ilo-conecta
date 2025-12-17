import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, Users, Armchair, QrCode, XCircle, Trash2 } from 'lucide-react';

function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar reservaciones');
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reservación?')) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al cancelar reservación');
      }

      fetchReservations();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-12 text-xl">Cargando reservaciones...</div>;
  if (error) return <div className="text-center py-12 text-xl text-red-600">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-mesa-text">Mis Reservaciones</h1>
        <div className="bg-mesa-orange text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">
          {reservations.length} {reservations.length === 1 ? 'Reservación' : 'Reservaciones'}
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl shadow-lg border border-mesa-sidebar">
          <span className="text-6xl mb-4 opacity-20">📅</span>
          <p className="text-xl text-gray-600 font-medium">No tienes ninguna reservación activa.</p>
          <p className="text-gray-400 mt-2">¡Explora los restaurantes y reserva tu mesa!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col relative group">
              {/* Header with Image Background */}
              <div className="h-32 relative overflow-hidden">
                <div className="absolute inset-0">
                  <img 
                    src={reservation.restaurantImage} 
                    alt={reservation.restaurantName} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 p-6 flex justify-between items-start gap-4 h-full flex-col justify-end">
                  <div className="flex justify-between items-end w-full">
                    <h3 className="text-xl font-bold text-white leading-tight shadow-sm">{reservation.restaurantName}</h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                      {reservation.status === 'confirmed' ? 'Confirmada' : reservation.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="p-6 flex-1 space-y-6">
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Fecha</span>
                    </div>
                    <p className="font-bold text-gray-800 text-lg leading-tight">
                      {(() => {
                        const dateStr = new Date(reservation.date).toLocaleDateString('es-MX', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        });
                        // Capitalize: "jue., 18 dic." -> "Jue., 18 Dic."
                        return dateStr.replace(/\b\w/g, l => l.toUpperCase());
                      })()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Hora</span>
                    </div>
                    <p className="font-bold text-gray-800 text-lg leading-tight">{reservation.time.slice(0, 5)}</p>
                  </div>
                </div>

                {/* Guests & Table */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Users size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Personas</span>
                    </div>
                    <p className="font-medium text-gray-700">{reservation.guests}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Armchair size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Mesa</span>
                    </div>
                    <p className="font-medium text-gray-700">#{reservation.tableNumber}</p>
                  </div>
                </div>
              </div>

              {/* Ticket Divider */}
              <div className="relative h-px bg-gray-200 mx-6">
                <div className="absolute -left-9 -top-3 w-6 h-6 rounded-full bg-mesa-bg"></div>
                <div className="absolute -right-9 -top-3 w-6 h-6 rounded-full bg-mesa-bg"></div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-4 space-y-3">
                <details className="group/qr">
                  <summary className="flex items-center justify-between cursor-pointer list-none p-3 rounded-xl hover:bg-orange-50 transition-colors text-mesa-orange">
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <QrCode size={18} />
                      <span>Ver Código QR</span>
                    </div>
                    <span className="transition-transform group-open/qr:rotate-180 text-xs">▼</span>
                  </summary>
                  <div className="mt-4 flex justify-center bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
                    <QRCodeSVG
                      value={JSON.stringify({
                        id: reservation.id,
                        restaurant: reservation.restaurantName,
                        table: reservation.tableNumber,
                        date: reservation.date,
                        time: reservation.time
                      })}
                      size={140}
                      level={"M"}
                    />
                  </div>
                </details>

                <button
                  className="w-full py-3 px-4 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 font-medium text-sm transition-all flex items-center justify-center gap-2 group/cancel"
                  onClick={() => cancelReservation(reservation.id)}
                >
                  <Trash2 size={16} className="group-hover/cancel:stroke-red-500 transition-colors" />
                  <span>Cancelar Reservación</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReservationsList;
