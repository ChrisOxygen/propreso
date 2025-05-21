import { STEPS_DATA } from "@/constants";
import clsx from "clsx";
import { useCreateProfileContext } from "../../context/CreateProfileContext";

function StepIndicator() {
  const {
    state: { currentStep },
  } = useCreateProfileContext();

  return (
    <div className="flex w-full items-center gap-5">
      {STEPS_DATA.map((_, index) => {
        return (
          <span
            key={index}
            className={clsx(
              "h-[8px] w-full rounded-full transition-colors duration-200",
              currentStep === index + 1 ? "bg-[#BF4008]" : "bg-[#F8E5DB]",
            )}
          ></span>
        );
      })}
    </div>
  );
}

export default StepIndicator;
