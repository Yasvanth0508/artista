// FIX: Implemented AboutSection component without translations.
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-100 dark:bg-gray-800 animate-on-scroll">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-white mb-4">
          Empowering Artisans, Inspiring Collectors
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Our mission is to provide a global stage for artisans to showcase their talent and for art lovers
          to discover unique pieces that truly resonate. We blend technology with tradition to create a vibrant,
          supportive community where creativity thrives.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
