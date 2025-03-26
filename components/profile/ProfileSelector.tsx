import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type PrismaUserProfile = {
  id: string;
  jobTitle: string;
  isDefault: boolean;
};

type ProfileSelectorProps = {
  profiles: PrismaUserProfile[] | undefined;
  selectedProfileId: string | undefined;
  profilesLoading: boolean;
  handleProfileSelect: (id: string) => void;
};

function ProfileSelector({
  profiles,
  selectedProfileId,
  handleProfileSelect,
  profilesLoading,
}: ProfileSelectorProps) {
  // Show loading state when profiles are loading
  if (profilesLoading) {
    return (
      <div className="min-w-[220px] px-4 py-5 text-base rounded-lg border flex items-center gap-2 text-gray-500 cursor-not-allowed">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading profiles...</span>
      </div>
    );
  }

  // Return null if no profiles
  if (!profiles || profiles.length === 0) {
    return null;
  }

  // Find the default profile ID to use if no profile is selected
  const defaultProfileId =
    profiles.find((p) => p.isDefault)?.id || profiles[0]?.id;

  // Use the selectedProfileId if provided, otherwise fall back to the default profile
  const effectiveProfileId = selectedProfileId || defaultProfileId;

  return (
    <Select
      onValueChange={(value) => {
        handleProfileSelect(value);
      }}
      value={effectiveProfileId}
      disabled={profilesLoading}
    >
      <SelectTrigger className="min-w-[220px] px-4 py-5 text-base rounded-lg">
        <SelectValue placeholder="Select a Profile" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            <h4 className="font-bold">Profiles</h4>
          </SelectLabel>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              <div className="flex items-center gap-2">
                {profile.jobTitle}
                {profile.isDefault && (
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs bg-gray-100 text-gray-800 border-gray-200"
                  >
                    Default
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ProfileSelector;
