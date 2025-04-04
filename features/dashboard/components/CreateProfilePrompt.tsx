import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

const CreateProfilePrompt = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-gray-800" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome aboard!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Create a freelance profile to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Setting up your profile helps personalize your experience and
            connects you with the features that matter most to you.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link href="/profile/create">
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 px-6 py-5">
              Create Profile
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateProfilePrompt;
