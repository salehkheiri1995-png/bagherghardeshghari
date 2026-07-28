"use client";

import { type ComponentType, type ReactNode, Suspense, lazy } from "react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  );
}

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return <Suspense fallback={fallback || <LoadingSpinner />}>{children}</Suspense>;
}

export function lazyLoad<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(factory);

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
