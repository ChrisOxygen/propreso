import { useState } from "react";
import { useUserProfiles } from "@/hooks/user-profile-hooks/useUserProfiles";
import { useProfile } from "@/hooks/user-profile-hooks/useProfile";

export function useDashboardActions() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [expandBio, setExpandBio] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    data: profiles,
    isLoading: profilesLoading,
    error,
    isSuccess: profilesFetchSuccessful,
  } = useUserProfiles();

  const { data: selectedProfileDetails, isLoading: profileDetailsLoading } =
    useProfile(selectedProfileId);

  if (profilesFetchSuccessful && !selectedProfileId && profiles?.length > 0) {
    const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0];
    setSelectedProfileId(defaultProfile.id);
  }

  const handleEditTitle = () => {
    console.log("Edit title");
  };

  const handleEditBio = () => {
    console.log("Edit bio");
  };

  const handleEditProject = (projectId: string) => {
    console.log(`Edit project ${projectId}`);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id);
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };

  const toggleBioExpand = () => {
    setExpandBio(!expandBio);
  };

  return {
    selectedProfileId,
    expandBio,
    showSidebar,
    profiles,
    selectedProfileDetails,
    profilesLoading,
    profileDetailsLoading,
    error,
    handleEditTitle,
    handleEditBio,
    handleEditProject,
    toggleSidebar,
    handleProfileSelect,
    toggleBioExpand,
  };
}
