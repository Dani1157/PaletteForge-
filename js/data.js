/* ════════════════════════════════════════════
   CONSTANTS & DATA
════════════════════════════════════════════ */

// Font pairings
const FONTS = [
    { h: 'Playfair Display', b: 'Source Sans Pro', l: 'Editorial Classic', tags: ['Serif', 'Elegant', 'Publishing'] },
    { h: 'Syne', b: 'IBM Plex Sans', l: 'Geometric Modern', tags: ['Display', 'Sans', 'Tech'] },
    { h: 'Fraunces', b: 'Jost', l: 'Organic Warmth', tags: ['Serif', 'Warm', 'Friendly'] },
    { h: 'Bebas Neue', b: 'Lato', l: 'Bold Impact', tags: ['Display', 'Strong', 'Branding'] },
    { h: 'Cormorant Garamond', b: 'Nunito', l: 'Refined & Approachable', tags: ['Serif', 'Classic', 'Luxury'] },
    { h: 'DM Serif Display', b: 'DM Sans', l: 'Clean Sophistication', tags: ['Serif', 'Contemporary'] },
];

// Templates
const TMPLS = [
    { name: 'Launch SaaS', cat: 'SaaS', badge: 'Popular', desc: 'High-conversion hero, features, pricing, CTA' },
    { name: 'Creative Portfolio', cat: 'Portfolio', badge: 'New', desc: 'Elegant case study layout with dark hero' },
    { name: 'Shop Minimal', cat: 'E-Commerce', badge: '', desc: 'Clean product grid with cart and filters' },
    { name: 'Agency Bold', cat: 'Agency', badge: 'Hot', desc: 'Statement site with services, team, contact' },
    { name: 'Content Blog', cat: 'Blog', badge: '', desc: 'Long-form layout with sidebar and newsletter' },
    { name: 'Healthcare Trust', cat: 'SaaS', badge: '', desc: 'Professional medical landing with booking' },
    { name: 'Event Page', cat: 'Agency', badge: '', desc: 'Conference marketing with schedule and tickets' },
    { name: 'SaaS Dashboard', cat: 'SaaS', badge: '', desc: 'Full app UI with sidebar navigation and charts' },
    { name: 'Restaurant', cat: 'Portfolio', badge: 'New', desc: 'Food-forward design with menu and reservations' },
];

// Export formats
const EF = [
    { id: 'css', icon: '🎨', name: 'CSS Variables', desc: '`:root` custom properties' },
    { id: 'scss', icon: '💅', name: 'SCSS Variables', desc: 'Sass `$variable` format' },
    { id: 'tw', icon: '🌊', name: 'Tailwind Config', desc: '`tailwind.config.js` colors' },
    { id: 'json', icon: '📦', name: 'Design Tokens', desc: 'W3C token JSON format' },
    { id: 'figma', icon: '⬡', name: 'Figma Values', desc: 'Copy-paste for Figma' },
    { id: 'android', icon: '🤖', name: 'Android XML', desc: '`colors.xml` resource' }
];

// Explore palettes
const EXPLORE = {
    trending: [
        { base: '#e63946', colors: ['#1d1b1e', '#e63946', '#f4a261', '#e9c46a', '#2a9d8f'], name: 'Cinematic' },
        { base: '#06d6a0', colors: ['#0d1b2a', '#06d6a0', '#118ab2', '#073b4c', '#ffd166'], name: 'Deep Ocean' },
        { base: '#f72585', colors: ['#10002b', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'], name: 'Neon Dusk' },
        { base: '#e9c46a', colors: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'], name: 'Earthy Tropics' },
        { base: '#9b5de5', colors: ['#f15bb5', '#fee440', '#00bbf9', '#00f5d4', '#9b5de5'], name: 'Candy Pop' },
        { base: '#2d6a4f', colors: ['#1b4332', '#2d6a4f', '#40916c', '#74c69d', '#d8f3dc'], name: 'Forest Mint' },
        { base: '#e2711d', colors: ['#3a1a00', '#e2711d', '#cb6e17', '#ffba08', '#ffd60a'], name: 'Golden Hour' },
        { base: '#0077b6', colors: ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'], name: 'Arctic Blue' },
    ],
    curated: [
        { base: '#c9b99a', colors: ['#f5ebe0', '#e3d5ca', '#d5bdaf', '#c9b99a', '#b08968'], name: 'Warm Sand' },
        { base: '#bc6c25', colors: ['#fefae0', '#dda15e', '#bc6c25', '#606c38', '#283618'], name: 'Harvest' },
        { base: '#4a4e69', colors: ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'], name: 'Muted Violet' },
        { base: '#e07a5f', colors: ['#3d405b', '#81b29a', '#f2cc8f', '#e07a5f', '#f4f1de'], name: 'Coastal Warm' },
    ],
    seasonal: [
        { base: '#d4a373', colors: ['#fefae0', '#fef0c7', '#fde68a', '#f59e0b', '#d4a373'], name: 'Summer Gold' },
        { base: '#e63946', colors: ['#1d1b1e', '#264653', '#e63946', '#457b9d', '#a8dadc'], name: 'Winter Frost' },
        { base: '#588157', colors: ['#3a5a40', '#588157', '#a3b18a', '#dad7cd', '#344e41'], name: 'Spring Forest' },
        { base: '#e2711d', colors: ['#6b3a2a', '#e2711d', '#c9a227', '#8b5e3c', '#3d2314'], name: 'Autumn Ember' },
    ],
    industry: [
        { base: '#0077b6', colors: ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'], name: 'FinTech' },
        { base: '#06d6a0', colors: ['#0d1b2a', '#06d6a0', '#118ab2', '#073b4c', '#ffd166'], name: 'Healthcare' },
        { base: '#e63946', colors: ['#1d1b1e', '#e63946', '#f4a261', '#e9c46a', '#2a9d8f'], name: 'Food & Bev' },
        { base: '#9b5de5', colors: ['#10002b', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'], name: 'Creative Agency' },
    ]
};

// Preview URLs
const PREV_URLS = {
    landing: 'yoursite.com',
    dashboard: 'app.yoursite.com/dash',
    ecommerce: 'shop.yoursite.com',
    blog: 'blog.yoursite.com',
    saas: 'app.yoursite.com',
    portfolio: 'portfolio.design'
};

// Color keyword mapping for image search
const colorKwMap = {
    red: 'red sunset dramatic',
    orange: 'orange autumn warm',
    yellow: 'golden sunlight',
    green: 'forest green nature',
    teal: 'teal ocean water',
    blue: 'blue sky minimal',
    indigo: 'dark night stars',
    purple: 'purple lavender field',
    pink: 'pink cherry blossom',
    neutral: 'minimal concrete white'
};

// Trending chips (empty state)
const TRENDS = [
    { h: '#e63946', n: 'Crimson' },
    { h: '#06d6a0', n: 'Mint' },
    { h: '#9b5de5', n: 'Violet' },
    { h: '#f72585', n: 'Fuchsia' },
    { h: '#0077b6', n: 'Ocean' },
    { h: '#e2711d', n: 'Amber' },
    { h: '#2d6a4f', n: 'Forest' },
    { h: '#e8a020', n: 'Gold' }
];