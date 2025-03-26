import { useState, useEffect } from "react";
import { useUserProfiles } from "@/hooks/user-profile-hooks/useUserProfiles";

export function useDashboardActions() {
  const [activeProfile, setActiveProfile] = useState<
    PrismaUserProfile | undefined
  >(undefined);
  const [expandBio, setExpandBio] = useState(false);

  const {
    data: profiles,
    isLoading: profilesLoading,
    error,
    isSuccess: profilesFetchSuccessful,
  } = useUserProfiles();

  useEffect(() => {
    const defaultProfile = profiles?.find((p) => p.isDefault);
    setActiveProfile(defaultProfile);
  }, [profiles]);

  const toggleBioExpand = () => {
    setExpandBio(!expandBio);
  };

  const handleEditTitle = () => {
    console.log("Edit title");
  };

  const handleEditBio = () => {
    console.log("Edit bio");
  };

  const handleEditProject = (projectId: string) => {
    console.log(`Edit project ${projectId}`);
  };

  const handleSetActiveProfile = (profilId: string) => {
    const profile = profiles?.find((p) => p.id === profilId);
    setActiveProfile(profile);
    console.log("Set active profile", profile);
  };

  return {
    activeProfile,
    expandBio,
    profiles,
    profilesLoading,
    error,
    profilesFetchSuccessful,
    toggleBioExpand,
    handleEditTitle,
    handleEditBio,
    handleEditProject,
    handleSetActiveProfile,
  };
}
