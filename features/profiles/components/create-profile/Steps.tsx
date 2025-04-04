import { STEPS_DATA } from "@/constants";
import clsx from "clsx";
import { useCreateProfileContext } from "../../context/CreateProfileContext";

function Steps() {
  return (
    <div className="flex ">
      <ul className="flex md:flex-col gap-6 md:gap-10">
        <Step stepNumber={1} />
        <Step stepNumber={2} />
        <Step stepNumber={3} />
      </ul>
    </div>
  );
}

export default Steps;

function Step({ stepNumber }: { stepNumber: number }) {
  const {
    state: { currentStep },
  } = useCreateProfileContext();
  const stepData = STEPS_DATA[stepNumber - 1];
  const isActive = stepNumber === currentStep;

  if (!stepData) return null;

  const { title, description, icon: Icon } = stepData;

  return (
    <li
      className={clsx(
        " relative flex gap-3  after:absolute md:after:left-[25px] after:left-[100%]  md:after:top-[100%] after:top-[50%] md:after:w-[1px] after:w-[24px] md:after:h-full after:h-[1px] after:bg-gray-500",
        isActive ? "text-Black" : "text-gray-500",
        stepNumber === 3 ? "after:hidden" : ""
      )}
    >
      <div
        className={clsx(
          " size-[50px] text-xl text-inherit grid place-items-center rounded-xl border-[2px]",
          isActive
            ? "bg-gray-50 border-gray-300"
            : "bg-gray-100 border-gray-200"
        )}
      >
        <Icon className="text-inherit" />
      </div>
      <div className="md:flex hidden flex-col">
        <h5 className=" font-bold">{title}</h5>
        <span className="">{description}</span>
      </div>
    </li>
  );
}
