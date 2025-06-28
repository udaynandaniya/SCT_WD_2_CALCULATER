
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle';
import CalculatorKeyboard from '../components/CalculatorKeyboard';

export default function CalculatorPage() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleButtonClick = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => {
    setExpression('');
    setResult(null);
    setAiExplanation(null);
  };

  const handleCalculate = () => {
    try {
      const res = Function(`return (${expression})`)();
      setResult(res.toString());
      toast.success('Calculation successful!');
    } catch {
      setResult('Error');
      toast.error('Invalid expression.');
    }
  };

  const handleAIAnalyze = async () => {
    if (!expression) {
      toast.warning('Enter an expression first!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiExplanation(data.explanation);
        toast.success('AI analysis complete.');
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch {
      toast.error('Failed to connect to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-950 via-blue-900 to-black text-white dark:from-gray-200 dark:via-white dark:to-gray-300 dark:text-black transition-colors duration-300">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/70 border border-white/20 dark:border-gray-400 shadow-2xl rounded-2xl w-full max-w-xs p-6 space-y-4">
        <div className="bg-white/20 dark:bg-gray-200 p-4 rounded text-right font-mono text-xl shadow-inner text-white dark:text-black min-h-[3rem] overflow-x-auto whitespace-nowrap">
          <div>{expression}</div>
          {result && <div className="text-green-300 dark:text-green-700 font-bold">= {result}</div>}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              className="bg-white/30 dark:bg-gray-300 text-white dark:text-black font-semibold py-2 rounded-xl shadow-inner hover:bg-white/40 dark:hover:bg-gray-400 transition duration-200 active:scale-95"
              onClick={() => {
                if (btn === '=') handleCalculate();
                else handleButtonClick(btn);
              }}
            >
              {btn}
            </button>
          ))}

          <button
            onClick={handleClear}
            className="col-span-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl shadow-md transition active:scale-95"
          >
            Clear
          </button>

          <button
            onClick={handleAIAnalyze}
            className="col-span-4 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : '🔍 Analyze with AI'}
          </button>

          <button
            onClick={() => router.push('/scientific')}
            className="col-span-4 bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded-xl shadow-md transition active:scale-95"
          >
            Scientific Calculator
          </button>
        </div>

        {aiExplanation && (
          <div className="mt-4 p-3 rounded bg-white/20 dark:bg-gray-300 text-sm text-blue-200 dark:text-blue-900">
            <strong>AI says:</strong> {aiExplanation}
          </div>
        )}
      </div>

        <CalculatorKeyboard onKeyPress={(key) => {
        if (key === '=') handleCalculate();
        else if (key === 'C') handleClear();
        else handleButtonClick(key);
      }} />
      <ThemeToggle />


    </div>
  );
}
