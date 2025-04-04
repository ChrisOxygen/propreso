import clsx from "clsx";
import { ProfileSuggestions } from "../actions";

type ProfileSuggestionsProps = {
  isVisible: boolean;
  profileStengthMessage: string;
  colorClass: string;
};

const ProfileSuggestionsUI = ({
  isVisible,
  profileStengthMessage,
  colorClass,
}: ProfileSuggestionsProps) => {
  if (!isVisible) return null;

  const suggestions: ProfileSuggestions = JSON.parse(
    profileStengthMessage as string
  );
  const {
    bio: { message: bioMsg },
    skills: { message: skillsMsg },
    projects: { message: projectsMsg },
  } = suggestions;

  console.log("Suggestions:", suggestions);

  if (bioMsg === "good" && skillsMsg === "good" && projectsMsg === "good") {
    return (
      <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm">
        <h4 className="font-medium mb-2">All Good:</h4>
      </div>
    );
    // return <ProfileLacking profileStengthMessage={profileStengthMessage} />;
  }

  const suggestionsArray = Object.entries(suggestions).map(([key, value]) => {
    if (value.message !== "good") {
      return {
        title: key,
        message: value.message,
      };
    } else return; // Skip good suggestions
  });

  // Filter out undefined values from the array
  const filteredSuggestionsArray = suggestionsArray.filter(
    (suggestion) => suggestion !== undefined
  ) as { title: string; message: string }[];

  return (
    <ProfileLacking
      suggestionsArray={filteredSuggestionsArray}
      colorClass={colorClass}
    />
  );
};

export default ProfileSuggestionsUI;

const ProfileLacking = ({
  suggestionsArray,
  colorClass,
}: {
  suggestionsArray: { title: string; message: string }[];
  colorClass: string;
}) => {
  return (
    <div className={clsx("mt-2 p-4 rounded-md text-sm", colorClass)}>
      <h4 className="font-medium text-lg mb-2">Improve your profile:</h4>
      <ul className="space-y-1">
        {suggestionsArray.map((suggestion) => {
          return (
            <li
              key={suggestion.title}
              className={clsx(
                "list-disc flex flex-col gap-3 pb-3 not-last:mb-3  not-last:border-b-[2px]",
                colorClass
              )}
            >
              <h4 className="uppercase font-semibold">{suggestion.title}</h4>
              <span className=" ">{suggestion.message}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
