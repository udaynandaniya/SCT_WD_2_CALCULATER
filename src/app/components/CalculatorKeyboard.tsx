
'use client';

import { useEffect } from 'react';

interface Props {
  onKeyPress: (key: string) => void;
}

export default function CalculatorKeyboard({ onKeyPress }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const validKeys = '0123456789/*-+().'.split('');
      if (validKeys.includes(e.key) || e.key === 'Enter' || e.key === 'Backspace') {
        if (e.key === 'Enter') onKeyPress('=');
        else if (e.key === 'Backspace') onKeyPress('C');
        else onKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  return null;
}
