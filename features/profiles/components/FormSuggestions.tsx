const FormSuggestions = () => {
  return (
    <div className="rounded-lg border border-[#F8E5DB] bg-[#FDF9F6] p-4">
      <h3 className="mb-2 font-[Poppins] text-sm font-medium tracking-[-0.4px] text-[#2C2C2C]">
        Tips for a Great Project
      </h3>
      <ul className="space-y-2 font-[Lato] text-xs tracking-[0.08px] text-[#404040]">
        <li className="flex items-start">
          <span className="mr-1 font-medium text-[#2C2C2C]">Title:</span> Use a
          clear, concise name that describes what your project does.
        </li>
        <li className="flex items-start">
          <span className="mr-1 font-medium text-[#2C2C2C]">Description:</span>{" "}
          Include the problem it solves, technologies used, and any notable
          features.
        </li>
        <li className="flex items-start">
          <span className="mr-1 font-medium text-[#2C2C2C]">Links:</span> Add
          both repository and live demo links when possible.
        </li>
        <li className="flex items-start">
          <span className="mr-1 font-medium text-[#2C2C2C]">Image:</span> Use a
          screenshot that clearly shows your project interface.
        </li>
      </ul>
    </div>
  );
};

export default FormSuggestions;
