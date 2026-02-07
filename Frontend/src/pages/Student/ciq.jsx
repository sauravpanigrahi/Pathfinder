import { useEffect, useState } from "react";
import {
  BookOpen,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";

const Ciq = () => {
  const [questions, setQuestions] = useState([]);
  const [domain, setDomain] = useState("javascript");
  const [difficulty, setDifficulty] = useState("");
  const [openAnswer, setOpenAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        domain,
        ...(difficulty && { difficulty }),
      });

      const res = await fetch(
        `https://pathfinder-maob.onrender.com/api/interview-questions?${params}`,
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [domain, difficulty]);

  const getDifficultyColor = (level) => {
    const colors = {
      easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
      medium: "bg-amber-50 text-amber-700 border-amber-200",
      hard: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return colors[level] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const domainIcons = {
    javascript: "JS",
    html: "HTML",
    css: "CSS",
    "frontend-system-design": "FSD",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Premium Interview Prep
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Master Your Interview
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Industry-vetted questions with comprehensive explanations. Prepare
            like a pro, interview with confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Real Interview Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Expert Explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Multiple Difficulty Levels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 -mt-8">
        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Questions
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 font-medium focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50"
              >
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="frontend-system-design">
                  Frontend System Design
                </option>
                <option value="data analysis">data analysis</option>
                <option value="predictive modeling">predictive modeling</option>
                <option value="probability">probability</option>
                <option value="product metrics">product metrics</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 font-medium focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{questions.length}</span>
            <span>questions found</span>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Questions Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more questions.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="group bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-indigo-100 text-indigo-700 rounded-xl w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                            {domainIcons[domain]}
                          </span>
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(q.difficulty)}`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                          {q.question}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setOpenAnswer(openAnswer === q.id ? null : q.id)
                    }
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm group/btn transition-colors"
                  >
                    {openAnswer === q.id ? (
                      <>
                        <ChevronDown className="w-4 h-4 transition-transform" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        Show Answer
                      </>
                    )}
                  </button>

                  {openAnswer === q.id && (
                    <div className="mt-6 pt-6 border-t-2 border-gray-100">
                      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-indigo-600" />
                          <span className="font-semibold text-gray-900">
                            Answer
                          </span>
                        </div>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ciq;
