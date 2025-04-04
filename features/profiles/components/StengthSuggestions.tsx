import clsx from "clsx";

type StengthSuggestionsProps = {
  isVisible: boolean;
  title: string;
  suggestions?: string;
  colorClass?: string;
};

function StengthSuggestions({
  isVisible,
  title,

  suggestions,
  colorClass,
}: StengthSuggestionsProps) {
  if (!isVisible) return null;

  return (
    <div
      className={clsx("mt-2 p-3 bg-gray-100 rounded-md text-sm", colorClass)}
    >
      <h4 className="font-medium mb-2">Improve your {title}:</h4>
      {/* <ul className="list-disc pl-5 space-y-1">
        {suggestions &&
          suggestions.length > 0 &&
          suggestions.map((suggestion, index) => {
            return (
              <li key={index} className="flex flex-col gap-2 pb-4 pt-2">
                {suggestion}:
              </li>
            );
          })}
      </ul> */}
      <p className="">{suggestions}</p>
    </div>
  );
}

export default StengthSuggestions;
