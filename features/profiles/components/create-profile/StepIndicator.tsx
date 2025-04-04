import { STEPS_DATA } from "@/constants";
import clsx from "clsx";
import { useCreateProfileContext } from "../../context/CreateProfileContext";

function StepIndicator() {
  const {
    state: { currentStep },
  } = useCreateProfileContext();
  return (
    <div className=" w-full flex items-center gap-5">
      {STEPS_DATA.map((_, index) => {
        return (
          <span
            key={index}
            className={clsx(
              " h-[8px] rounded-full w-full ",
              currentStep === index + 1 ? "bg-black" : "bg-gray-300"
            )}
          ></span>
        );
      })}
    </div>
  );
}

export default StepIndicator;
