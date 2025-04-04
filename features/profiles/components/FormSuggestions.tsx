const FormSuggestions = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        Tips for a Great Project
      </h3>
      <ul className="text-xs text-gray-600 space-y-2">
        <li className="flex items-start">
          <span className="font-medium mr-1">Title:</span> Use a clear, concise
          name that describes what your project does.
        </li>
        <li className="flex items-start">
          <span className="font-medium mr-1">Description:</span> Include the
          problem it solves, technologies used, and any notable features.
        </li>
        <li className="flex items-start">
          <span className="font-medium mr-1">Links:</span> Add both repository
          and live demo links when possible.
        </li>
        <li className="flex items-start">
          <span className="font-medium mr-1">Image:</span> Use a screenshot that
          clearly shows your project interface.
        </li>
      </ul>
    </div>
  );
};

export default FormSuggestions;
