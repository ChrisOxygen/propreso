import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
          Craft Winning Proposals in Minutes
        </h1>

        <p className="text-xl md:text-2xl mb-12 text-gray-700">
          Use the power of Claude AI to create compelling, personalized
          freelance proposals that help you win more clients and save hours of
          work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-black text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition-colors inline-block"
          >
            Get Started
          </Link>
          <Link
            href="/demo"
            className="px-8 py-3 bg-white text-black font-medium rounded-lg shadow-md border-2 border-black hover:bg-gray-100 transition-colors inline-block"
          >
            See How It Works
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-black font-medium rounded-lg shadow-md border-2 border-black hover:bg-gray-100 transition-colors inline-block sm:ml-0"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
