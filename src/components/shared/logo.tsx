import { useNavigate } from "react-router-dom";

export function Logo() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="w-28 h-10 rounded-md bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg flex items-center justify-center cursor-pointer select-none"
      aria-label="Event Ticketing System"
      title="Go to Dashboard"
    >
      <span className="text-white font-semibold tracking-wider">ETS</span>
    </div>
  );
}

export default Logo;
