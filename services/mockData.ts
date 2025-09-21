import { Product } from '../types';

const artists = [
    { id: 'artist-1', name: 'Elena Petrova', avatarUrl: 'https://picsum.photos/seed/artist1/100/100', location: 'Paris, France', bio: 'A contemporary painter inspired by impressionism and the play of light in nature.', phone: '+33 1 23 45 67 89' },
    { id: 'artist-2', name: 'Kenji Tanaka', avatarUrl: 'https://picsum.photos/seed/artist2/100/100', location: 'Kyoto, Japan', bio: 'Digital artist exploring themes of futurism, technology, and identity in the digital age.', phone: '+81 75-123-4567' },
    { id: 'artist-3', name: 'Aisha Khan', avatarUrl: 'https://picsum.photos/seed/artist3/100/100', location: 'Mumbai, India', bio: 'Watercolorist who captures the vibrant and dynamic life of Indian cities.', phone: '+91 22 9876 5432' },
    { id: 'artist-4', name: 'Carlos Gomez', avatarUrl: 'https://picsum.photos/seed/artist4/100/100', location: 'Oaxaca, Mexico', bio: 'A master potter carrying on the rich legacy of Zapotec ceramic art.', phone: '+52 951 123 4567' },
    { id: 'artist-5', name: 'Fatima Al-Fassi', avatarUrl: 'https://picsum.photos/seed/artist5/100/100', location: 'Marrakech, Morocco', bio: 'Textile artist known for intricate weaving and use of traditional natural dyes.', phone: '+212 524 876 543' },
];

const reviews = [
    { id: 'rev-1', author: 'Jane Doe', rating: 5, comment: 'Absolutely stunning piece! The colors are so vibrant.', createdAt: '2 days ago', avatarUrl: 'https://picsum.photos/seed/jane/40/40' },
    { id: 'rev-2', author: 'John Smith', rating: 4, comment: 'Great quality and fast shipping.', createdAt: '1 week ago', avatarUrl: 'https://picsum.photos/seed/john/40/40' },
];

const USD_TO_INR = 83;

export const mockProducts: Product[] = [
    {
        ownerId: 'mock',
        id: 'prod-1',
        title: 'Whispers of the Forest',
        artist: artists[0],
        images: ['https://picsum.photos/seed/prod1/800/600', 'https://picsum.photos/seed/prod1-detail/800/600', 'https://picsum.photos/seed/prod1-context/800/600'],
        description: 'An evocative oil painting that captures the serene and mystical atmosphere of a sun-dappled forest. The play of light and shadow creates a sense of depth and tranquility.',
        details: { dimensions: '24x36 in', materials: 'Oil on canvas', creationDate: '2023' },
        price: 250.00 * USD_TO_INR,
        currency: '₹',
        tags: ['landscape', 'oil', 'nature', 'serene'],
        postedAt: '3 hours ago',
        likes: 134,
        views: 2500,
        sales: 12,
        rating: 4.8,
        reviewCount: 15,
        reviews: reviews,
        artType: 'Paintings',
    },
    {
        ownerId: 'mock',
        id: 'prod-2',
        title: 'Cybernetic Dreams',
        artist: artists[1],
        images: ['https://picsum.photos/seed/prod2/800/600', 'https://picsum.photos/seed/prod2-alt/800/600'],
        description: 'A high-resolution digital artwork exploring the intersection of humanity and technology. This piece is a commentary on our increasingly digital existence.',
        details: { dimensions: '4000x6000 px', materials: 'Digital, Procreate', creationDate: '2024' },
        price: 99.99 * USD_TO_INR,
        currency: '₹',
        tags: ['digital', 'cyberpunk', 'futuristic', 'portrait'],
        postedAt: '1 day ago',
        likes: 450,
        views: 8200,
        sales: 55,
        rating: 4.9,
        reviewCount: 32,
        reviews: reviews,
        artType: 'Digital Art',
    },
    {
        ownerId: 'mock',
        id: 'prod-3',
        title: 'Terracotta Warrior',
        artist: artists[3],
        images: ['https://picsum.photos/seed/prod3/800/600'],
        description: 'A hand-molded pottery sculpture inspired by ancient Zapotec traditions. Each piece is unique and carries the spirit of Oaxacan craftsmanship.',
        details: { dimensions: '12 in height', materials: 'Red clay, Natural pigments', creationDate: '2023' },
        price: 180.00 * USD_TO_INR,
        currency: '₹',
        tags: ['sculpture', 'pottery', 'traditional', 'mexican'],
        postedAt: '5 days ago',
        likes: 88,
        views: 1500,
        sales: 5,
        rating: 4.5,
        reviewCount: 8,
        reviews: [],
        artType: 'Pottery',
    },
    {
        ownerId: 'mock',
        id: 'prod-4',
        title: 'Marrakech Blues',
        artist: artists[4],
        images: ['https://picsum.photos/seed/prod4/800/600', 'https://picsum.photos/seed/prod4-context/800/600', 'https://picsum.photos/seed/prod4-closeup/800/600'],
        description: 'A handwoven textile piece using indigo dyes, reflecting the iconic blue hues of Moroccan architecture. Perfect as a wall hanging or a decorative throw.',
        details: { dimensions: '4x6 ft', materials: 'Wool, Cotton, Natural Indigo Dye', creationDate: '2024' },
        price: 320.50 * USD_TO_INR,
        currency: '₹',
        tags: ['textiles', 'weaving', 'indigo', 'moroccan'],
        postedAt: '2 weeks ago',
        likes: 215,
        views: 4300,
        sales: 22,
        rating: 5.0,
        reviewCount: 18,
        reviews: reviews,
        artType: 'Textiles',
    },
    {
        ownerId: 'mock',
        id: 'prod-5',
        title: 'Mumbai Monsoon',
        artist: artists[2],
        images: ['https://picsum.photos/seed/prod5/800/600'],
        description: 'A dynamic watercolor painting capturing the chaotic beauty of a monsoon day in Mumbai. The artist uses vibrant splashes of color to convey energy and movement.',
        details: { dimensions: '18x24 in', materials: 'Watercolor on paper', creationDate: '2023' },
        price: 45.00 * USD_TO_INR,
        currency: '₹',
        tags: ['watercolor', 'cityscape', 'india', 'rain'],
        postedAt: '1 month ago',
        likes: 95,
        views: 2100,
        sales: 18,
        rating: 4.7,
        reviewCount: 12,
        reviews: [],
        artType: 'Paintings'
    },
    ...Array.from({ length: 20 }, (_, i) => ({
        ownerId: 'mock',
        id: `prod-extra-${i}`,
        title: `Generated Artwork ${i + 1}`,
        artist: artists[i % artists.length],
        images: [`https://picsum.photos/seed/extra${i}/800/600`],
        description: `This is a beautiful piece of generated artwork, showcasing unique styles and techniques. Number ${i + 1} in a series of procedurally created masterpieces.`,
        details: { dimensions: '20x20 in', materials: 'Mixed Media', creationDate: '2024' },
        price: parseFloat(((Math.random() * 300 + 20) * USD_TO_INR).toFixed(2)),
        currency: '₹',
        tags: ['abstract', 'generated', i % 2 === 0 ? 'colorful' : 'monochrome'],
        postedAt: `${i + 1} days ago`,
        likes: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 10000),
        sales: Math.floor(Math.random() * 50),
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 40),
        reviews: [],
        artType: ['Paintings', 'Digital Art', 'Photography'][i % 3],
        availability: i % 4 === 0 ? 'Pre-order' : 'In Stock' as 'In Stock' | 'Pre-order',
    }))
];

export const mockProductTitlesAndTags = mockProducts.reduce((acc, p) => {
    acc.push(p.title);
    p.tags.forEach(tag => {
        if (!acc.includes(tag)) {
            acc.push(tag);
        }
    });
    return acc;
}, [] as string[]);
