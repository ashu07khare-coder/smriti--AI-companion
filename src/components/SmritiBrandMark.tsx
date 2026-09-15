import React from 'react';

interface BrandMarkProps {
  variant?: 'horizontal' | 'stacked' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showWordmark?: boolean;
}

export const SmritiFlowerIcon: React.FC<{ className?: string; sizePx?: number }> = ({
  className = '',
  sizePx = 36,
}) => {
  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Smriti flower icon"
    >
      {/* Squircle background */}
      <rect width="100" height="100" rx="26" fill="#F5C244" />

      {/* 5 Petals rotated at 72 degree intervals in #173C36 */}
      <g transform="translate(50, 50)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <path
            key={idx}
            d="M 0 -7 C -9 -14, -13 -26, 0 -36 C 13 -26, 9 -14, 0 -7 Z"
            fill="#173C36"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Negative space center circle letting the yellow show through */}
        <circle cx="0" cy="0" r="7.5" fill="#F5C244" />
      </g>
    </svg>
  );
};

export const SmritiBrandMark: React.FC<BrandMarkProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 64,
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const currentIconSize = iconSizes[size];

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <SmritiFlowerIcon sizePx={currentIconSize} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <SmritiFlowerIcon sizePx={currentIconSize} />
        <span className={`font-semibold tracking-tight text-[#173C36] font-sans lowercase ${textSizes[size]}`}>
          smriti
        </span>
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <SmritiFlowerIcon sizePx={currentIconSize} />
      <span className={`font-bold tracking-tight text-[#173C36] font-sans lowercase leading-none ${textSizes[size]}`}>
        smriti
      </span>
    </div>
  );
};
