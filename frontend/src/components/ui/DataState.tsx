import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";
import { Icon } from "./Icon";

interface DataStateProps<T> {
  loading: boolean;
  error: string | null;
  data: T[] | null;
  skeleton: ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  emptyIcon?: string;
  onRetry?: () => void;
  children: (data: T[]) => ReactNode;
}

/** Standardized loading / error / empty / data rendering for list views. */
export function DataState<T>({
  loading,
  error,
  data,
  skeleton,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  onRetry,
  children,
}: DataStateProps<T>) {
  if (loading) return <>{skeleton}</>;
  if (error) {
    return (
      <EmptyState
        icon="error"
        title="Couldn't load data"
        description={error}
        action={
          onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              <Icon name="refresh" className="text-[18px]" /> Retry
            </Button>
          )
        }
      />
    );
  }
  if (!data || data.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }
  return <>{children(data)}</>;
}