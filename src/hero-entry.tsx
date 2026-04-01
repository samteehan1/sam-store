import { createRoot } from 'react-dom/client';
import { HeroSnowboard } from './HeroSnowboard';

const heroRootElement = document.getElementById('hero-root');

if (heroRootElement) {
  createRoot(heroRootElement).render(<HeroSnowboard />);
}
