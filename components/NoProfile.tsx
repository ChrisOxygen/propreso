import Link from "next/link";

function NoProfile() {
  return (
    <div className="grid place-items-center h-full w-full">
      <div className="bg-white p-6 text-center max-w-lg">
        <h3 className="text-4xl font-bold mb-3">Complete Your Profile</h3>
        <p className="mb-5">
          Please create your profile to help our AI assistant understand your
          needs and generate more accurate information for you.
        </p>
        <Link
          href="/create-profile"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
        >
          Create Profile
        </Link>
      </div>
    </div>
  );
}

export default NoProfile;
