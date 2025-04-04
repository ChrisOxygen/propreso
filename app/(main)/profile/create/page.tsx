"use client";

import CreateProfileTips from "@/features/profiles/components/create-profile/CreateProfileTips";
import MultiStepForm from "@/features/profiles/components/create-profile/MultiStepForm";
import StepIndicator from "@/features/profiles/components/create-profile/StepIndicator";
import Steps from "@/features/profiles/components/create-profile/Steps";
import { CreateProfileProvider } from "@/features/profiles/context/CreateProfileContext";

function CreateProfilePage() {
  return (
    <CreateProfileProvider>
      <main className="h-full justify-items-center   grid-rows-[200px_1fr] md:grid-rows-none grid grid-cols-1 p-4 md:grid-cols-[450px_1fr] gap-4">
        <div className=" flex flex-col max-w-[600px] md:items-start items-center w-full rounded-2xl p-6 bg-gray-50">
          <h3 className=" font-bold text-xl sm:text-2xl mb-[24px] sm:mb-[40px] md:mb-[90px]">
            Create your profile
          </h3>
          <Steps />
          <div className="md:block hidden mt-auto">
            <CreateProfileTips />
          </div>
        </div>
        <div className=" grid justify-stretch grid-rows-[1fr_30px] h-full w-full justify-items-center md:p-6">
          <div className=" max-w-[600px] ">
            <div className="md:hidden block">
              <CreateProfileTips />
            </div>
            <MultiStepForm />
          </div>
          <div className=" w-full justify-center max-w-[600px] hidden md:flex">
            <StepIndicator />
          </div>
        </div>
      </main>
    </CreateProfileProvider>
  );
}

export default CreateProfilePage;
