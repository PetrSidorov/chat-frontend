export default function Avatar() {
  return (
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="circleView">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="50" fill="#eeeeee" />

      <g clipPath="url(#circleView)">
        <circle cx="50" cy="30" r="20" fill="#999999" />
        <path
          d="M10 100c0-23.196 18.804-42 42-42s42 18.804 42 42H10z"
          fill="#999999"
        />
      </g>
    </svg>
  );
}
