import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

const ProjectStrength = ({
  strength,
  suggestions,
  isLoading,
}: ProjectStrengthProps) => {
  // Determine color based on strength
  const getColorClass = (strength: number): string => {
    if (strength < 30) return "bg-red-50 border-red-200 text-red-800";
    if (strength < 70) return "bg-orange-50 border-orange-200 text-orange-800";
    return "bg-green-50 border-green-200 text-green-800";
  };

  const colorClass = getColorClass(strength);

  if (isLoading) {
    return <Skeleton className=" h-[120px] w-full rounded-lg" />;
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClass}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Project Strength</h3>
        <span className={`text-xs font-medium  `}>{strength}%</span>
      </div>

      <Progress
        value={strength}
        className={clsx(
          "h-2 mb-3 [&>div]:${progressBarColor}",
          strength >= 75 && "[&>div]:bg-green-500",
          strength >= 50 && strength < 75 && "[&>div]:bg-yellow-500",
          strength >= 25 && strength < 50 && "[&>div]:bg-red-500"
        )}
      />

      {suggestions && suggestions.length > 0 && strength !== 100 && (
        <>
          <p className="text-xs font-medium mb-1">Suggestions to improve:</p>
          <ul className="text-xs flex flex-col gap-2">
            {suggestions.map((suggestion, index) => {
              const { name, description, examples } = suggestion;
              return (
                <li key={index} className=" last:border-0 border-b pb-4 pt-2">
                  <div className="flex flex-col gap-2">
                    <strong className="">{name}:</strong>
                    <span className=""> {description} </span>
                    <div className="">
                      <strong className=" flex flex-col gap-2">
                        examples:
                      </strong>
                      <ul className="flex flex-col">
                        <li className=" mb-[2px]">{examples[0]}</li>
                        <li className="">{examples[1]}</li>
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {strength === 100 && (
        <>
          <h3 className="text-sm font-medium  mb-2">Great job!</h3>
          <ul className="text-xs  space-y-2">
            <li className="flex items-start">
              Your project is strong and ready to be shared with the world.
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default ProjectStrength;
