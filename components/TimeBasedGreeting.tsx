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
    return <Skeleton className="w-[200px] h-6" />;
  }

  // Handle error state
  if (error) {
    return <div>Error loading user details: {error.message}</div>;
  }

  // If no user data is available
  if (!user || !user.fullName) {
    return <div>Welcome, guest!</div>;
  }

  // Return the greeting with the user's name
  return (
    <div className=" hidden md:flex items-center gap-2">
      <p className=" font-semibold text-gray-500">
        {getGreeting()},
        <span className=" text-black capitalize"> {user.fullName}!</span>
      </p>
    </div>
  );
}

export default TimeBasedGreeting;
