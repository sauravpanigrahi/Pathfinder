import { useEffect, useState } from "react";
import {
  BookOpen,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronRight,
  Check,
  Code
} from "lucide-react";

const coding = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("");
  const [openAnswer, setOpenAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category,
        ...(difficulty && { difficulty })
      });

      const res = await fetch(
        `https://pathfinder-maob.onrender.com/api/coding-questions?${params}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to fetch coding questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty]);

  const getDifficultyColor = (level) => {
    const colors = {
      easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
      medium: "bg-amber-50 text-amber-700 border-amber-200",
      hard: "bg-rose-50 text-rose-700 border-rose-200"
    };
    return colors[level?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 rounded-lg p-3">
              <Code className="w-8 h-8" />
            </div>
            <div className="bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Coding Interview Prep
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4">Crack Coding Interviews</h1>
          <p className="text-xl text-emerald-100 max-w-2xl">
            Curated DSA problems with clean explanations & optimal solutions.
          </p>

          <div className="mt-8 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-300" />
              FAANG-style Questions
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-300" />
              Optimized Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 -mt-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Filter Coding Questions</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 min-w-[200px] rounded-xl border-2 px-4 py-3"
            >
              <option>Arrays</option>
              <option>Strings</option>
              <option>Linked Lists</option>
              <option>Trees</option>
              <option>Graphs</option>
              <option>Dynamic Programming</option>
              <option>Stacks</option>
              <option>Queues</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="flex-1 min-w-[200px] rounded-xl border-2 px-4 py-3"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <strong>{questions.length}</strong> questions found
          </div>
        </div>

        {/* Questions */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="space-y-4 pb-12">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white rounded-2xl border shadow-sm">
                <div className="p-6">
                  <div className="flex gap-4 mb-3">
                    <div className="bg-emerald-100 w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <span className={`text-xs px-3 py-0.5 rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      <h3 className="text-lg font-semibold mt-2">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {q.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setOpenAnswer(openAnswer === q.id ? null : q.id)}
                    className="text-emerald-600 font-medium text-sm flex items-center gap-2"
                  >
                    {openAnswer === q.id ? <ChevronDown /> : <ChevronRight />}
                    {openAnswer === q.id ? "Hide Solution" : "Show Solution"}
                  </button>

                  {openAnswer === q.id && (
                    <pre className="mt-4 bg-slate-50 p-4 rounded-xl text-sm overflow-x-auto">
                      {q.answer}
                    </pre>
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

export default coding;
