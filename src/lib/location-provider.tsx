
"use client";

// This component is currently a pass-through. 
// It was previously used to trigger location requests globally, but that has been moved
// to the MainLayout to improve initial load performance.
// It's kept for potential future use or can be removed if deemed unnecessary.
export function LocationProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
