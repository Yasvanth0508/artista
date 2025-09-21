import React from 'react';

interface BaseProps {
  name: string;
  className?: string;
  isFilled?: boolean; // for Material icons
}

interface SVGIconProps extends BaseProps {
  type?: 'svg';
  path?: string; // SVG path data
}

interface MaterialIconProps extends BaseProps {
  type?: 'material';
}

type IconProps = SVGIconProps | MaterialIconProps;

const Icon: React.FC<IconProps> = ({
  name,
  className = 'text-2xl',
  isFilled = false,
  type = 'material',
  path,
  ...props
}) => {
  if (type === 'svg') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d={path || name}></path>
      </svg>
    );
  }

  // Default: Material Icons
  const iconFontClass = isFilled ? 'material-icons' : 'material-icons-outlined';
  return (
    <span className={`${iconFontClass} ${className}`} aria-hidden="true">
      {name}
    </span>
  );
};

export default Icon;
