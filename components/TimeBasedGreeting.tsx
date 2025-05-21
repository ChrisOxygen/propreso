"use client";

import { useUser } from "@/hooks/useUser";
import { Skeleton } from "./ui/skeleton";

function TimeBasedGreeting() {
  const { data: user, isPending, error } = useUser();

  // Function to determine the appropriate greeting based on time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Handle loading state
  if (isPending) {
    return <Skeleton className="h-6 w-[200px]" />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="font-[Lato] text-[#BF4008]">
        Error loading user details: {error.message}
      </div>
    );
  }

  // If no user data is available
  if (!user || !user.fullName) {
    return (
      <div className="font-[Lato] tracking-[0.08px] text-[#404040]">
        Welcome, guest!
      </div>
    );
  }

  // Return the greeting with the user's name
  return (
    <div className="hidden items-center gap-2 md:flex">
      <p className="font-[Lato] text-[#404040]">
        {getGreeting()},
        <span className="font-[Poppins] font-semibold tracking-[-0.4px] text-[#2C2C2C] capitalize">
          {" "}
          {user.fullName}!
        </span>
      </p>
    </div>
  );
}

export default TimeBasedGreeting;
