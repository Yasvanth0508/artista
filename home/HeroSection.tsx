import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden px-4">

            <img
                src="https://cdn.pixabay.com/photo/2015/12/15/05/43/starry-night-1093721_1280.jpg"
                alt="Artistic background"
                className="absolute z-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
            <div className="relative z-10 p-4">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                    Discover, Shop & Sell Art
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
                    A marketplace that connects creative minds with art lovers worldwide.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg"
                    >
                        Login
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
