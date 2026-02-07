import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Companyques() {
  const { companySlug } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    axios
      .get("https://pathfinder-maob.onrender.com/api/company-questions", {
        params: { company_slug: companySlug },
      })
      .then((res) => {
        console.log(res.data);
        setQuestions(res.data);
      })
      .finally(() => setLoading(false));
  }, [companySlug]);

  const companyName = companySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Filter questions by difficulty
  const filteredQuestions =
    selectedDifficulty === "All"
      ? questions
      : questions.filter((q) => q.difficulty === selectedDifficulty);

  // Difficulty color mapping
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "hard":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {companyName}
              </h1>
              <p className="text-blue-100 mt-1 text-lg">
                Interview Questions Collection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold">{questions.length}</span>
              <span className="text-blue-100 ml-2">Total Questions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">
              Filter by Difficulty:
            </span>
            {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedDifficulty === difficulty
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              No questions available yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for updates!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredQuestions.map((q, index) => (
              <div
                key={q.id}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Question Header */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0 mt-1">
                      {index + 1}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {q.title}
                    </h2>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex-shrink-0 ${getDifficultyColor(
                      q.difficulty,
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-4 pl-11">
                  {q.description}
                </p>

                {/* Topics */}
                {q.topics && (
                  <div className="flex flex-wrap gap-2 mb-4 pl-11">
                    {(Array.isArray(q.topics)
                      ? q.topics
                      : typeof q.topics === "string"
                        ? q.topics.includes("[")
                          ? JSON.parse(q.topics)
                          : q.topics.split(",")
                        : []
                    ).map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:border-blue-400 transition-colors"
                      >
                        <svg
                          className="w-3 h-3 mr-1.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {String(t).trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Approach */}
                {q.approach && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-4 rounded-r-lg ml-11">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div>
                        <strong className="text-emerald-800 font-semibold">
                          Approach:
                        </strong>
                        <p className="text-emerald-900 mt-1">{q.approach}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
