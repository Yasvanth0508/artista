// FIX: Implemented Footer component without translations.
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-brand-dark shadow-inner mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 dark:text-gray-400">
                <p>
                    © {new Date().getFullYear()} <a href="/" className="hover:underline">Artista</a>. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
