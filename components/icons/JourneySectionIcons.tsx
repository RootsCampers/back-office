export const MapPinIcon = ({
  className = "",
  circleClassName = "",
}: {
  className?: string;
  circleClassName?: string;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        className={circleClassName}
        fill="hsl(var(--muted))"
      />
    </svg>
  );
};

export const CamperIcon = ({
  className = "",
  fillClassName = "",
}: {
  className?: string;
  fillClassName?: string;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 30 30"
    fill="none"
    className={className}
  >
    <path
      d="M13.6,13.7c0,0.3-0.3,0.6-0.6,0.6H7.6c-0.2,0-0.4-0.1-0.5-0.3s-0.1-0.4,0-0.6l1.4-2.1C8.6,11.1,8.8,11,9,11h4
	c0.3,0,0.6,0.3,0.6,0.6V13.7z M26.3,13.7c0,0.2-0.2,0.4-0.4,0.4H23c-0.2,0-0.4-0.2-0.4-0.4v-2.3c0-0.2,0.2-0.4,0.4-0.4h2.9
	c0.2,0,0.4,0.2,0.4,0.4V13.7z M27.6,22.4h0.7c0,0,0.3-0.1,0.5-0.2c0.4-0.2,0.7-0.5,0.9-0.8c0.1-0.2,0.2-0.3,0.3-0.5
	c0.1-0.2,0.1-0.4,0.1-0.6v-8.1V6.4c-0.1-0.6-0.6-1.2-1.2-1.2H5.1c-0.2,0-0.4,0.1-0.6,0.3L3.1,6.9C2.9,7.1,2.8,7.3,2.8,7.5v1.2
	c0,0.5,0.4,0.9,0.9,0.9h4c-0.8,1.4-3.3,4.9-3.3,4.9C4.3,14.6,1,16.8,1,16.8c-0.7,0.4-1,0.8-1,1.7v1.7c0,0.3,0.1,0.5,0.2,0.8
	c0.2,0.4,0.4,0.7,0.7,0.9c0.2,0.1,0.3,0.2,0.5,0.3c0.2,0.1,1.1,0.2,1.4,0.2l1.6,0c0,0,0-0.1,0-0.1c0-1.9,1.6-3.6,3.6-3.6
	c2.1,0,3.8,1.6,3.6,3.6c0,0,0,0.1,0,0.1l8.8,0c0,0,0-0.1,0-0.1c0-1.9,1.7-3.6,3.6-3.6c2.1,0,3.8,1.6,3.6,3.6
	C27.6,22.3,27.6,22.4,27.6,22.4L27.6,22.4z"
      fill="currentColor"
      className={fillClassName}
    />
    <path
      d="M8,19.9c-1.3,0-2.4,1.1-2.4,2.4s1.1,2.4,2.4,2.4s2.4-1.1,2.4-2.4C10.5,21,9.4,19.9,8,19.9z"
      fill="currentColor"
      className={fillClassName}
    />
    <path
      d="M24,19.9c-1.3,0-2.4,1.1-2.4,2.4s1.1,2.4,2.4,2.4s2.4-1.1,2.4-2.4S25.3,19.9,24,19.9z"
      fill="currentColor"
      className={fillClassName}
    />
  </svg>
);

export const LargeMapIcon = ({
  className = "",
  pathClassName = "",
  fillClassName = "",
}: {
  className?: string;
  pathClassName?: string;
  fillClassName?: string;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 50 50"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line
      x1="32.3"
      y1="44.5"
      x2="17.7"
      y2="37.2"
      fill="none"
      className={pathClassName}
    />
    <line
      x1="17.7"
      y1="5.5"
      x2="32.3"
      y2="12.8"
      fill="none"
      className={pathClassName}
    />
    <line
      x1="32.3"
      y1="12.8"
      x2="32.3"
      y2="44.5"
      strokeWidth="2"
      className={pathClassName}
    />
    <polygon
      points="32.3,12.8 46.9,5.5 46.9,37.2 32.3,44.5"
      fill="currentColor"
      stroke="currentColor"
      className={`${fillClassName} ${pathClassName}`}
    />
    <polygon
      points="17.7,5.5 3.1,12.8 3.1,44.5 17.7,37.2"
      fill="currentColor"
      stroke="currentColor"
      className={`${fillClassName} ${pathClassName}`}
    />
  </svg>
);
