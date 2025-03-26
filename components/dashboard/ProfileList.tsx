import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileListProps {
  profiles: PrismaUserProfile[] | undefined;
  selectedProfileId: string | null;
  isLoading: boolean;
  onProfileSelect: (id: string) => void;
}

export function ProfileList({
  profiles,
  selectedProfileId,
  isLoading,
  onProfileSelect,
}: ProfileListProps) {
  if (isLoading) {
    return (
      <>
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="mb-3">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
      </>
    );
  }

  if (!profiles?.length) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 mb-4">No profiles yet</p>
        <Link href="/dashboard/create-profile">
          <Button className="bg-black text-white hover:bg-gray-800">
            Create Profile
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {profiles.map((profile) => (
        <Card
          key={profile.id}
          className={`mb-3 cursor-pointer hover:border-gray-400 w-full transition-colors ${
            profile.id === selectedProfileId ? "border-black" : ""
          }`}
          onClick={() => onProfileSelect(profile.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{profile.jobTitle}</h3>
              </div>
              {profile.isDefault && (
                <Badge variant="outline" className="bg-black text-white">
                  Default
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
