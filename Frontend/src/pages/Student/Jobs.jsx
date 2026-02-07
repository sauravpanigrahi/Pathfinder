import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import JobCard from "../../components/JobCard";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "/src/css/Loader.css";
import { toast } from "react-toastify";
import Resume from "../../components/Resume";
import { useAppContext } from "../../AppContext";
import ChatBot from "../../components/chatbot";
import Chatboticon from "../../components/chatboticon";
import { Loader, DeleteLoader } from "../../components/loader";
import { Trash } from "lucide-react";
const Jobs = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ types: {}, locations: {} });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();
  const { resume } = useAppContext();
  const userID = localStorage.getItem("userUID") || null;
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);
  useEffect(() => {
    const fetchJobsWithMatch = async () => {
      if (!userID) {
        navigate("/");
        return;
      }
      try {
        const res = await axios.get(
          `https://pathfinder-maob.onrender.com/jobs/with-match/${userID}`,
          { withCredentials: true },
        );
        console.log("jobs", res.data);
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs with match:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsWithMatch();
  }, [userID, navigate]);

  const openJobs = useMemo(
    () => jobs.filter((j) => j.status?.toLowerCase() === "active"),
    [jobs],
  );
  const filteredJobs = useMemo(() => {
    const activeTypes = Object.keys(filters.types).filter(
      (k) => filters.types[k],
    );
    const activeLocations = Object.keys(filters.locations).filter(
      (k) => filters.locations[k],
    );

    return openJobs
      .filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((job) =>
        activeTypes.length ? activeTypes.includes(job.type) : true,
      )
      .filter((job) =>
        activeLocations.length ? activeLocations.includes(job.location) : true,
      );
  }, [search, filters, openJobs]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;
    const end = start + jobsPerPage;
    return filteredJobs.slice(start, end);
  }, [filteredJobs, currentPage]);

  const sortedPaginatedJobs = useMemo(() => {
    return [...paginatedJobs].sort(
      (a, b) => b.match_percentage - a.match_percentage,
    );
  }, [paginatedJobs]);

  const topMatchId = sortedPaginatedJobs[0]?.id;

  // 🔄 Loader
  if (loading) {
    return <Loader />;
  }
  const handleDeleteResume = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );
    if (!confirmed || deleting) return;
    try {
      setDeleting(true);
      await axios.delete(
        `https://pathfinder-maob.onrender.com/student/resume/delete/${userID}`,
        { withCredentials: true },
      );
      toast.success("Resume deleted successfully");
      // ✅ Update UI instead of reload
      setResumeFile(null);
      setIsDeleted(true);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting resume. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Open Positions
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Explore the latest openings curated for you
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* 🔍 Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search roles or companies..."
                className="w-72 rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔎
              </span>
            </div>
            {/* 📤 Upload / View Resume Button */}
            <div className="inline-flex items-center gap-2 rounded-2xl border border-green-600/30 bg-white px-3 py-2 shadow-sm">
              <Resume />
              {resume && !isDeleted && (
                <button
                  onClick={handleDeleteResume}
                  disabled={deleting}
                  className={`inline-flex items-center justify-center rounded-xl border p-2 transition-all
                ${
                  deleting
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                }
              `}
                  title="Delete Resume"
                >
                  {deleting ? (
                    <DeleteLoader />
                  ) : (
                    <Trash size={20} strokeWidth={1.8} />
                  )}
                </button>
              )}
            </div>

            <button
              className=" p-2 rounded rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/interviewprep")}
            >
              Interview Prep
            </button>
          </div>
        </div>

        {/* 🧾 Job List */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <Sidebar filters={filters} setFilters={setFilters} />
          </div>
          <div className="lg:col-span-9">
            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
                No matching open roles. Try adjusting your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-2">
                {sortedPaginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    Resume={resume}
                    isTopMatch={job.id === topMatchId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* 🧠 Floating Chatbot Icon */}
      <Chatboticon />
    </div>
  );
};

export default Jobs;
