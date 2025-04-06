import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Define the option type
type Option = {
  value: string;
  label: string;
};

// Define the component props
interface ProfileSelectorUIProps {
  options: Option[];
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  defaltId: string | null;
}

/**
 * A custom Select component using shadcn/ui that updates external state
 */
const ProfileSelectorUI = ({
  options,
  label,
  placeholder = "Select an option",
  value,
  onChange,
  className = "",
  disabled = false,
  defaltId,
}: ProfileSelectorUIProps) => {
  // Handler for when the selection changes
  const handleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  console.log("defaultId", defaltId);

  return (
    <div
      className={`flex lg:flex-row flex-col w-max  gap-2 items-center ${className}`}
    >
      {label && (
        <label className=" @[900px]:inline hidden text-lg  font-mono lg:text-left text-center font-bold  grow shrink-0 text-gray-700 dark:text-gray-300">
          {label}:
        </label>
      )}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full max-w-[300px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-gray-400 focus:border-gray-400">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-900 w-full max-w-[400px] lg:max-w-[500px] text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between w-full"
              >
                {option.label}
                {defaltId !== null && defaltId === option.value && (
                  <Badge className="text-white font-bold ml-[40px] ">
                    {" "}
                    Default
                  </Badge>
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfileSelectorUI;
