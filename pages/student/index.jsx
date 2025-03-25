import { useRouter } from 'next/router';

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Quiz Section */}
        <div className="bg-blueShade p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl mb-4">Search for Quizzes</h2>
          <button
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            onClick={() => router.push('/quiz/search')}
          >
            Search Quizzes
          </button>
        </div>

        {/* View Results Section */}
        <div className="bg-blueShade p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl mb-4">View Results</h2>
          <button
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            onClick={() => router.push('/quiz/results')}
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}
