import React, { useEffect } from 'react';
import HeroSection from '../home/HeroSection';
import AboutSection from '../home/AboutSection';
import FeaturesGrid from '../home/FeaturesGrid';

const HomePage: React.FC = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
        );

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

        return () => elements.forEach((el) => observer.unobserve(el));
    }, []);

    return (
        <div>
            <HeroSection />
            <AboutSection />
            <FeaturesGrid />
        </div>
    );
};

export default HomePage;