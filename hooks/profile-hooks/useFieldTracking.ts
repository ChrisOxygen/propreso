// hooks/profile-hooks/useFieldTracking.ts
import { useState, useCallback } from "react";

interface FieldTrackingResult {
  bioTouched: boolean;
  projectsTouched: { [key: number]: boolean };
  handleBioFocus: () => void;
  handleProjectFocus: (index: number) => void;
  resetTracking: () => void;
}

/**
 * Custom hook to track which fields have been touched by the user
 * Used to decide when to trigger validation and API calls
 */
export function useFieldTracking(): FieldTrackingResult {
  const [bioTouched, setBioTouched] = useState(false);
  const [projectsTouched, setProjectsTouched] = useState<{
    [key: number]: boolean;
  }>({});

  const handleBioFocus = useCallback(() => {
    if (!bioTouched) {
      setBioTouched(true);
    }
  }, [bioTouched]);

  const handleProjectFocus = useCallback(
    (index: number) => {
      if (!projectsTouched[index]) {
        setProjectsTouched((prev) => ({
          ...prev,
          [index]: true,
        }));
      }
    },
    [projectsTouched]
  );

  const resetTracking = useCallback(() => {
    setBioTouched(false);
    setProjectsTouched({});
  }, []);

  return {
    bioTouched,
    projectsTouched,
    handleBioFocus,
    handleProjectFocus,
    resetTracking,
  };
}
