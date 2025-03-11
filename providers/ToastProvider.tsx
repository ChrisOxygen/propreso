// providers/ToastProvider.tsx
"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #e2e8f0",
        },
        duration: 2000,
      }}
    />
  );
}
