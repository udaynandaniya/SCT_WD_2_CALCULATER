
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 space-x-2 shadow-md border border-white/20">
      <button
        onClick={() => setTheme('light')}
        aria-label="Light Mode"
        className={theme === 'light' ? 'font-bold' : ''}
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme('dark')}
        aria-label="Dark Mode"
        className={theme === 'dark' ? 'font-bold' : ''}
      >
        🌙
      </button>
      <button
        onClick={() => setTheme('system')}
        aria-label="System Theme"
        className={theme === 'system' ? 'font-bold' : ''}
      >
        🖥
      </button>
    </div>
  );
}
