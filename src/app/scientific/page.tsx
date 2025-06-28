
'use client';

import { useState } from 'react';
import { evaluate } from 'mathjs';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from '../components/ThemeToggle';
import CalculatorKeyboard from '../components/CalculatorKeyboard';

const sciButtons = [
  'sin', 'cos', 'tan', 'log',
  'ln', '√', '^', 'π',
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '(', ')',
  'e', '=', '+', 'C',
];

const convertSymbol = (input: string) => {
  switch (input) {
    case 'π': return 'pi';
    case '√': return 'sqrt';
    case 'ln': return 'log';
    default: return input;
  }
};

export default function ScientificCalculatorPage() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const handleClick = (btn: string) => {
    if (btn === 'C') {
      setExpression('');
      setResult(null);
      setAiExplanation(null);
    } else if (btn === '=') {
      try {
        const converted = expression.replace(/π/g, 'pi').replace(/√/g, 'sqrt');
        const res = evaluate(converted);
        setResult(res.toString());
        toast.success('Calculation successful!');
      } catch {
        toast.error('Invalid expression');
        setResult('Error');
      }
    } else {
      const symbol = convertSymbol(btn);
      setExpression((prev) => prev + symbol);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'C') {
      setExpression('');
      setResult(null);
      setAiExplanation(null);
    } else if (key === '=') {
      try {
        const converted = expression.replace(/π/g, 'pi').replace(/√/g, 'sqrt');
        const res = evaluate(converted);
        setResult(res.toString());
        toast.success('Calculation successful!');
      } catch {
        toast.error('Invalid expression');
        setResult('Error');
      }
    } else {
      setExpression((prev) => prev + key);
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-950 via-blue-900 to-black text-white dark:from-gray-200 dark:via-white dark:to-gray-300 dark:text-black px-4 py-10 transition-colors duration-300">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/70 border border-white/20 dark:border-gray-400 shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Scientific Calculator</h1>

        <div className="bg-white/20 dark:bg-gray-200 p-4 rounded text-right font-mono text-xl shadow-inner text-white dark:text-black min-h-[3rem] overflow-x-auto whitespace-nowrap">
          <div>{expression}</div>
          {result && <div className="text-green-300 dark:text-green-700 font-bold">= {result}</div>}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {sciButtons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className="bg-white/30 dark:bg-gray-300 text-white dark:text-black font-semibold py-2 rounded-xl shadow-inner hover:bg-white/40 dark:hover:bg-gray-400 transition duration-200 active:scale-95"
            >
              {btn}
            </button>
          ))}
        </div>

        <Button
          onClick={handleAIAnalyze}
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 mt-4"
        >
          {loading ? 'Analyzing...' : '🔍 Analyze with AI'}
        </Button>

        {aiExplanation && (
          <div className="mt-4 p-3 rounded bg-white/20 dark:bg-gray-300 text-sm text-blue-200 dark:text-blue-900">
            <strong>AI says:</strong> {aiExplanation}
          </div>
        )}

        <Link href="/calculator">
          <Button variant="secondary" className="w-full mt-4">← Back to Basic</Button>
        </Link>
      </div>

      {/* Extra Support */}
      <CalculatorKeyboard onKeyPress={handleKeyPress} />
      <ThemeToggle />
    </div>
  );
}
