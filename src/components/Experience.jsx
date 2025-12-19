import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';

function Experience() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to the backend
        console.log({ rating, comment });
        setSubmitted(true);
        setTimeout(() => {
            navigate('/');
        }, 3000);
    };

    if (submitted) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl text-center border border-gray-100 max-w-lg animate-fade-in">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">💖</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Gracias por tu opinión!</h2>
                    <p className="text-gray-600">Nos alegra mucho saber qué piensas. Seguimos trabajando para mejorar tu experiencia.</p>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-2xl w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-primary-500 mb-4">Experiencia Final</h1>
                        <p className="text-gray-600 text-lg">¿Qué te pareció usar Ilo Conecta?</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="text-5xl transition-transform hover:scale-110 focus:outline-none"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(rating)}
                                    >
                                        <span className={`transition-colors ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'}`}>
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                {rating === 5 ? '¡Excelente!' : rating === 4 ? 'Muy bien' : rating === 3 ? 'Bien' : rating === 2 ? 'Regular' : rating === 1 ? 'Mal' : 'Califica tu experiencia'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Comentarios (opcional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Cuéntanos qué fue lo que más te gustó o qué podemos mejorar..."
                                rows="4"
                                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-0 transition-all resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={rating === 0}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-[1.01] text-lg"
                        >
                            Enviar Calificación
                        </button>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
}

export default Experience;
