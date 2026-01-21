import React, { useEffect, useState , useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "/src/css/Loader.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Chatboticon from '../../components/chatboticon';
import ATSScoreBar from "../../components/atsbar";
 import { useParams } from "react-router-dom";
const Smartreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userUID = localStorage.getItem("userUID") || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState(false);


 const { job_id } = useParams();
  // ✅ Fetch Resume and Load Saved AI Result (if exists)
  // console.log("jobid",job_id)
   const hasFetched = useRef(false);

  useEffect(() => {
    if (!userUID || !job_id) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchResume = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch resume
        const resumeRes = await axios.get(
          `https://pathfinder-qkw1.onrender.com/review/getresume/${userUID}`
        );

        // 2️⃣ Job-specific cache keys
        const analysisKey = `aiAnalysisResult_${job_id}`;
        const scoreKey = `aiScore_${job_id}`;

        let aiResult = localStorage.getItem(analysisKey);
        let aiScore = localStorage.getItem(scoreKey);

        aiResult = aiResult ? JSON.parse(aiResult) : null;
        aiScore = aiScore ? JSON.parse(aiScore) : null;

        // 3️⃣ Call AI ONLY if cache missing
        if (!aiResult || aiScore === null) {
          const aiRes = await axios.get(
            `https://pathfinder-qkw1.onrender.com/review/analyze_resume/${userUID}/${job_id}`
          );

          aiResult = aiRes.data.analysis;
          aiScore = aiRes.data.semantic_score;

          localStorage.setItem(analysisKey, JSON.stringify(aiResult));
          localStorage.setItem(scoreKey, JSON.stringify(aiScore));
        }

        // 4️⃣ Set state
        setReview({
          ...resumeRes.data,
          analysis: aiResult,
          semantic_score: aiScore,
        });

      }catch (err) {
  const status = err?.response?.status;

  if (status === 429) {
    // ⏳ Rate limit exceeded
    setAiError(true);
    setError("Too many AI requests. Please wait a minute and try again.");
     const retryAfter = err.response.headers["retry-after"];
    toast.error(`Please wait ${retryAfter} seconds before retrying.`)

  } else if (status === 500) {
    // 🤖 AI / server failure
    setAiError(true);
    setError("AI analysis failed. Please try again.");
    toast.error("AI analysis failed. Please try again.");

  } else if (status === 404) {
    // 📄 Resume not found
    setAiError(false);
    setError("Resume not found. Please upload your resume first.");
    toast.error("Resume not found.");

  } else {
    // ❓ Unknown error
    setAiError(true);
    setError("Something went wrong. Please try again later.");
    toast.error("Something went wrong.");
  }
}
finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [userUID, job_id]);

  // 🔁 Re-run analysis (manual)
  const rerunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const aiRes = await axios.get(
        `https://pathfinder-qkw1.onrender.com/review/analyze_resume/${userUID}/${job_id}`
      );

      setReview(prev => ({
        ...prev,
        analysis: aiRes.data.analysis,
        semantic_score: aiRes.data.semantic_score
      }));

      localStorage.setItem(
        `aiAnalysisResult_${job_id}`,
        JSON.stringify(aiRes.data.analysis)
      );
      localStorage.setItem(
        `aiScore_${job_id}`,
        JSON.stringify(aiRes.data.semantic_score)
      );

      toast.success("AI analysis updated!");
    } catch {
      toast.error("Failed to re-run analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  // // ✅ Loading State
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="liquid-loader">
  //         <div className="loading-text">
  //           Loading<span className="dot">.</span>
  //           <span className="dot">.</span>
  //           <span className="dot">.</span>
  //         </div>
  //         <div className="loader-track">
  //           <div className="liquid-fill"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // ✅ Error State
if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">

        {/* Icon */}
        <div className="mb-4 text-4xl">🤖</div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Smart Review Unavailable
        </h2>

        <p className="text-gray-600 mb-6">
          {error}
        </p>

        <div className="flex flex-col gap-3">
          {/* Retry AI */}
          {aiError && (
            <button
              onClick={rerunAnalysis}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry AI Analysis
            </button>
          )}

          {/* Upload resume fallback */}
          {/* <button
            onClick={() => navigate("/resume/upload")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Upload / Update Resume
          </button> */}

          {/* Go back */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

  // console.log("review",review)

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto  px-1">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-3 mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold">Resume Smart Review</h1>
            <p className="text-gray-600 mt-1">
              Get AI-powered insights on your resume’s strengths and improvements.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate(`/settings/${userUID}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/resume/upload")}
              className="px-4 py-2 border rounded"
            >
              Upload Resume
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume and AI Analysis */}
          <div className="p-2 flex flex-col md:flex-row gap-4 lg:col-span-3 md:col-span-2 ">
              {/* Uploaded Resume (Left Side) */}
              <section className="bg-white p-4 rounded-lg shadow w-full md:w-1/2 h-[500px] overflow-y-auto">
                <h3 className="text-md font-medium mb-2">Your Uploaded Resume</h3>
                {review?.url ? (
                    <iframe
                      src={review.url}
                      title="Uploaded Resume"
                      className="w-full h-[500px] border rounded"
                    />
                  ) : (
                    <p className="text-gray-500">No resume available</p>
                  )}
              </section>

              {/* AI Resume Analysis (Right Side) */}
              <section className="bg-white p-6 rounded-lg shadow w-full md:w-1/2 h-[500px] overflow-y-auto">

                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    AI Resume Analysis
                  </h2>
                  <button
                    onClick={rerunAnalysis}
                    disabled={analyzing}
                    className={`px-3 py-2 border rounded text-sm ${
                      analyzing
                        ? "bg-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {analyzing ? "Analyzing..." : "Re-run Analysis"}
                  </button>
                </div>

                {!review?.analysis ? (
                  <p className="text-gray-500">
                    No AI analysis available yet. Click "Re-run Analysis" to start.
                  </p>
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {review.analysis}
                    </ReactMarkdown>
                  </div>
                )}
              </section>
            </div>



          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow ml-2">
              <h3 className=" font-medium text-lg mb-2"></h3>
                <div>
            {review?.semantic_score !== undefined ? (
            <ATSScoreBar
              score={review.semantic_score}
              label="ATS Compatibility"
              showBadge={false}
            />
          ) : (
            <p className="text-gray-500 text-sm">ATS score not available</p>
          )}
            </div>
            </div>
          </aside>
        </div>
      </div>
      <Chatboticon/>
    </div>
  );
};

export default Smartreview;
