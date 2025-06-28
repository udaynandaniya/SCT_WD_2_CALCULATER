import React from 'react';

interface Props {
  children: React.ReactNode;
  cols?: number;
}

export default function ResponsiveGrid({ children, cols = 4 }: Props) {
  return (
    <div
      className={`grid gap-3`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
