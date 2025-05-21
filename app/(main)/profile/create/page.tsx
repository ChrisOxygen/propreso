"use client";

import CreateProfileTips from "@/features/profiles/components/create-profile/CreateProfileTips";
import MultiStepForm from "@/features/profiles/components/create-profile/MultiStepForm";
import StepIndicator from "@/features/profiles/components/create-profile/StepIndicator";
import Steps from "@/features/profiles/components/create-profile/Steps";
import { CreateProfileProvider } from "@/features/profiles/context/CreateProfileContext";

function CreateProfilePage() {
  return (
    <CreateProfileProvider>
      <main className="grid h-full grid-cols-1 grid-rows-[200px_1fr] justify-items-center gap-4 p-4 md:grid-cols-[450px_1fr] md:grid-rows-none">
        <div className="flex w-full max-w-[600px] flex-col items-center rounded-2xl bg-[#FDF9F6] p-6 md:items-start">
          <h3 className="mb-[24px] font-[Poppins] text-xl font-semibold tracking-[-0.4px] text-[#2C2C2C] sm:mb-[40px] sm:text-2xl md:mb-[90px]">
            Create your profile
          </h3>
          <Steps />
          <div className="mt-auto hidden md:block">
            <CreateProfileTips />
          </div>
        </div>
        <div className="grid h-full w-full grid-rows-[1fr_30px] justify-stretch justify-items-center md:p-6">
          <div className="max-w-[600px]">
            <div className="block md:hidden">
              <CreateProfileTips />
            </div>
            <MultiStepForm />
          </div>
          <div className="hidden w-full max-w-[600px] justify-center md:flex">
            <StepIndicator />
          </div>
        </div>
      </main>
    </CreateProfileProvider>
  );
}

export default CreateProfilePage;
