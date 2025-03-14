import JobDescriptionForm from "./JobDescriptionForm";

function JobDetailsSection() {
  return (
    <div className=" w-full grid relative h-full">
      {/* {(fetchStateStatus === "fetchJobDetails" ||
    fetchStateStatus === "analizingJobDetails") && (
    <SkeletonLoader
      height="h-full"
      text={`${fetchStatusMessage()} ... `}
    />
  )} */}
      <JobDescriptionForm />
    </div>
  );
}

export default JobDetailsSection;
