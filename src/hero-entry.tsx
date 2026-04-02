import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroSnowboard } from './HeroSnowboard';

const heroRootElement = document.getElementById('hero-root');

function HeroSequence() {
  const [showProduct, setShowProduct] = useState(false);
  const [heroActive, setHeroActive] = useState(true);

  useEffect(() => {
    const pageElement = document.querySelector('.page');
    if (!pageElement) return undefined;

    pageElement.classList.toggle('page--visible', showProduct);
    return undefined;
  }, [showProduct]);

  useEffect(() => {
    const shell = document.getElementById('hero-root');
    if (!shell) return undefined;
    // Outer fixed shell must release hit-testing too; children with pointer-events:auto still
    // capture unless this layer is explicitly pass-through after the ride ends.
    shell.style.pointerEvents = heroActive ? 'auto' : 'none';
    return undefined;
  }, [heroActive]);

  return (
    <div className="hero-root">
      <HeroSnowboard
        heroActive={heroActive}
        onReveal={() => setShowProduct(true)}
        onFinish={() => setHeroActive(false)}
      />
    </div>
  );
}

if (heroRootElement) {
  createRoot(heroRootElement).render(<HeroSequence />);
}
