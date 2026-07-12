import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-display-lg font-display text-primary">404</h1>
      <p className="text-body-lg text-on-surface mt-2">This sector is off the grid.</p>
      <Link to="/" className="mt-md text-primary hover:underline">Back to command center</Link>
    </div>
  );
}