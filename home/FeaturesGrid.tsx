import React from 'react';
import * as Icons from '../common/FeatureIcons';

interface Feature {
  icon: React.ComponentType;
  title: string;
  desc: string;
}

const buyerFeatures: Feature[] = [
  { icon: Icons.SearchIcon, title: 'Smart Search', desc: 'Find products quickly with advanced filters.' },
  { icon: Icons.ShoppingBagIcon, title: 'Explore Artworks', desc: 'Discover unique creations and enjoy a seamless shopping experience.'  },
  ];

const sellerFeatures: Feature[] = [
  { icon: Icons.AIToolsIcon, title: 'AI Tools', desc: 'Boost sales with AI-powered suggestions.' },
  { icon: Icons.SocialPostIcon, title: 'Social Post Creation', desc: 'Create engaging posts in minutes.' },
  { icon: Icons.AIChatbotIcon, title: 'AI Image Editor', desc: 'Enhance and transform your artworks instantly with AI.' },
  { icon: Icons.TrendAnalyticsIcon, title: 'Trend Analytics', desc: 'Track market trends in real-time.' },
  { icon: Icons.ProfessionalDashboardIcon, title: 'Professional Dashboard', desc: 'Manage your store efficiently.' },
];

const platformFeatures: Feature[] = [
  { icon: Icons.RealTimeTranslationIcon, title: 'Real-Time Translation', desc: 'Seamless communication across languages.' },
  { icon: Icons.MobileResponsiveIcon, title: 'Mobile Responsive', desc: 'Optimized for all devices.' },
  { icon: Icons.CommunityEngagementIcon, title: 'Community Engagement', desc: 'Build and connect with your community.' },
  { icon: Icons.QualityAssuranceIcon, title: 'Quality Assurance', desc: 'Ensuring top quality for all users.' },
  { icon: Icons.SecurePlatformIcon, title: 'Secure Platform', desc: 'Safe and secure transactions.' },
];

const FeatureCard: React.FC<{ feature: Feature; delay: number }> = ({ feature, delay }) => {
  const IconComponent = feature.icon;
  return (
    <div className="animate-on-scroll" style={{ transitionDelay: `${delay}ms` }}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-150 flex items-start space-x-4 border-2 border-transparent hover:border-brand-primary h-full">
        <div className="flex-shrink-0">
          <IconComponent />
        </div>
        <div>
          <h4 className="text-lg font-bold text-brand-dark dark:text-white mb-1">{feature.title}</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
        </div>
      </div>
    </div>
  );
};

const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Buyer Features */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8 text-brand-dark dark:text-white animate-on-scroll">
              For Buyers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {buyerFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} delay={index * 100} />
              ))}
            </div>
          </div>

          {/* Seller Features */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8 text-brand-dark dark:text-white animate-on-scroll">
              For Sellers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sellerFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} delay={index * 100} />
              ))}
            </div>
          </div>

          {/* Platform-wide Features */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8 text-brand-dark dark:text-white animate-on-scroll">
              Platform-wide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} delay={index * 100} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
