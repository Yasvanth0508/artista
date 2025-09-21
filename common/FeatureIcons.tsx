import React from 'react';

const IconWrapper: React.FC<{ iconName: string }> = ({ iconName }) => (
    <div className="h-8 w-8 flex items-center justify-center text-brand-primary dark:text-brand-secondary">
        <span className="material-icons-outlined" style={{ fontSize: '32px' }}>
            {iconName}
        </span>
    </div>
);

// Buyer Features
export const SearchIcon = () => <IconWrapper iconName="search" />;
export const ShoppingBagIcon = () => <IconWrapper iconName="shopping_bag" />;
export const WishlistIcon = () => <IconWrapper iconName="favorite" />;

// Seller Features
export const AIToolsIcon = () => <IconWrapper iconName="auto_awesome" />;
export const SocialPostIcon = () => <IconWrapper iconName="add_photo_alternate" />;
export const AIChatbotIcon = () => <IconWrapper iconName="smart_toy" />;
export const TrendAnalyticsIcon = () => <IconWrapper iconName="analytics" />;
export const ProfessionalDashboardIcon = () => <IconWrapper iconName="dashboard" />;

// Platform Features
export const MultiLanguageIcon = () => <IconWrapper iconName="language" />;
export const RealTimeTranslationIcon = () => <IconWrapper iconName="g_translate" />;
export const MobileResponsiveIcon = () => <IconWrapper iconName="devices" />;
export const CommunityEngagementIcon = () => <IconWrapper iconName="groups" />;
export const QualityAssuranceIcon = () => <IconWrapper iconName="verified" />;
export const SecurePlatformIcon = () => <IconWrapper iconName="security" />;
