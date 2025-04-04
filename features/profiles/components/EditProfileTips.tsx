import { Separator } from "@/components/ui/separator";

type EditProfileTipsProps = {
  profileProperty: string;
};

function EditProfileTips({ profileProperty }: EditProfileTipsProps) {
  const tips = [
    {
      title: "select your field",
      description: "Choose the field that best represents your expertise.",
    },
    {
      title: "add your skills",
      description:
        "List the skills you possess that are relevant to your field. list up to 8 skills to make your profile strong.",
    },

    {
      title: "write a bio",
      description:
        "Clear professional identity: Your title/role, years of experience, and primary specialization Technical expertise: Specific skills, tools, and technologies with indication of proficiency levels \nValue proposition: Problems you solve and benefits you deliver to clients/employers \nCredibility: Specific achievements with quantifiable results (numbers, percentages, metrics) \nA well-balanced bio will establish who you are professionally, showcase your technical capabilities, explain the value you provide, and validate your expertise with concrete accomplishments.",
    },
  ];

  const currentTipsToDisplay = profileProperty === "skills" ? tips[1] : tips[2];

  const { title, description } = currentTipsToDisplay || {};

  if (!title || !description) return null;

  return (
    <div className="mt-10 p-3 w-full bg-gray-100 rounded-md text-sm">
      <h4 className="font-medium uppercase mb-2">{title}</h4>
      <Separator className="mb-2" />
      <div className="flex flex-col gap-1 w-full">
        {profileProperty === "bio" ? (
          <div className=" flex text-gray-600 flex-col gap-2">
            <p className="">
              Write a concise bio (100-200 words) that includes
            </p>
            <ul className=" flex flex-col gap-2 list-disc pl-5">
              <li className="">
                Clear professional identity: Your title/role, years of
                experience, and primary specializatio
              </li>
              <li className="">
                Technical expertise: Specific skills, tools, and technologies
                with indication of proficiency levels
              </li>
              <li className="">
                Value proposition: Problems you solve and benefits you deliver
                to clients/employers
              </li>
              <li className="">
                Credibility: Specific achievements with quantifiable results
                (numbers, percentages, metrics)
              </li>
            </ul>
            <p className="">
              A well-balanced bio will establish who you are professionally,
              showcase your technical capabilities, explain the value you
              provide, and validate your expertise with concrete
              accomplishments.
            </p>
          </div>
        ) : (
          <p className="text-gray-600 ">{description}</p>
        )}
      </div>
    </div>
  );
}

export default EditProfileTips;
