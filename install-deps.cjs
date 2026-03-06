const { execSync } = require('child_process');
const packages = [
    'react-router-dom',
    'lucide-react',
    'framer-motion',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    'clsx',
    'tailwind-merge'
];
const devPackages = [
    'tailwindcss',
    'postcss',
    'autoprefixer'
];

try {
    console.log('Installing main packages...');
    execSync(`npm install ${packages.join(' ')}`, { stdio: 'inherit' });
    console.log('Installing dev packages...');
    execSync(`npm install -D ${devPackages.join(' ')}`, { stdio: 'inherit' });
    console.log('Done!');
} catch (e) {
    console.error('Failed:', e.message);
    process.exit(1);
}
