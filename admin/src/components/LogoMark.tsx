export default function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 3C10.6 3 3 10.6 3 20c0 5.1 2.3 9.7 5.9 12.8"
        stroke="#3AC7A6"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M8.9 32.8C11.9 35.4 15.8 37 20 37c9.4 0 17-7.6 17-17 0-4.4-1.7-8.5-4.5-11.5"
        stroke="#E0568C"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M32.5 8.5C29.3 5.3 24.9 3 20 3"
        stroke="#F5A93A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="5.5" fill="#fff" />
    </svg>
  );
}
