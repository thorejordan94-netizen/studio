import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M9 9l1.5-3L12 9l1.5-3L15 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21.35c-1.1-.9-7-6.45-7-12.35A7 7 0 0 1 12 2a7 7 0 0 1 7 7c0 5.9-5.9 11.45-7 12.35z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
