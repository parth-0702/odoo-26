import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";

export function Unauthorized() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <Icon name="lock" className="text-[56px] text-error mb-md" />
      <h1 className="text-headline-md font-display text-on-surface">Access Restricted</h1>
      <p className="text-body-md text-on-surface-variant mt-2 max-w-sm">
        Your role doesn't have permission to view this section.
      </p>
      <Link to="/" className="mt-md text-primary hover:underline">Return to dashboard</Link>
    </div>
  );
}