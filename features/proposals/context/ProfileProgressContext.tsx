// context/ProfileProgressContext.tsx
import { createContext, useRef } from "react";
import type { ProfileProgressRef } from "@/app/(main)/(profiles)/_components/profile-progress";

// Create a context with a RefObject of ProfileProgressRef type
export const ProfileProgressContext =
  createContext<React.RefObject<ProfileProgressRef | null> | null>(null);

// Provider component
export const ProfileProgressProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Create a ref to store the ProfileProgressRef
  const progressRef = useRef<ProfileProgressRef>(null);

  return (
    <ProfileProgressContext.Provider value={progressRef}>
      {children}
    </ProfileProgressContext.Provider>
  );
};
