import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import PageTransition from './PageTransition';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/events`);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-ilo-bg pb-20">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center space-x-3">
                        <Link to="/" className="text-gray-600 hover:text-primary-600">
                            <FaArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Eventos y Experiencias</h1>
                    </div>
                </header>

                {/* Events List */}
                <div className="max-w-screen-xl mx-auto px-4 py-6">
                    <div className="space-y-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                {/* Event Image */}
                                <div className="relative h-48">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {event.isFree && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            GRATIS
                                        </div>
                                    )}
                                </div>

                                {/* Event Info */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                                        <span className="ml-3 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
                                            {event.category}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>

                                    {/* Event Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <FaCalendar className="text-primary-500" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <FaMapMarkerAlt className="text-primary-500" />
                                            <span>{event.location}</span>
                                        </div>
                                        {event.organizer && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <FaTicketAlt className="text-primary-500" />
                                                <span>Organiza: {event.organizer}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition"
                                        onClick={() => alert(`Más información sobre ${event.title}`)}
                                    >
                                        Más Información
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
