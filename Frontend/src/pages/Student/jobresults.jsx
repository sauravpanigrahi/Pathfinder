import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const JobResults = () => {
  const location = useLocation();
  const navigate=useNavigate()
  const query = new URLSearchParams(location.search).get("query");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `https://pathfinder-maob.onrender.com/jobs/search?query=${query}`
        );
        setJobs(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [query]);
// const handleApply = (job) => {
//     navigate(`/Student/Apply/${job.uid}`, {
//       state: {
//         jobId: job.id,
//         jobTitle: job.title,
//         companyName: job.company,
//         jobLocation: job.location,
//         salary: job.salary,
//         jobType: job.type
//       }
//     });
//   };
  return (
    <div className="max-w-9xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for “{query}”
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                <span>💰 {job.salary}</span>
              </div>

              <p className="mt-3 text-gray-700 line-clamp-3">
                {job.description}
              </p>

              {job.skills && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.values(job.skills)
                    .flat()
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
               <div className="relative group inline-block">
              <button
                disabled
                className="mt-5 inline-flex items-center justify-center rounded-lg
                          bg-gray-400 px-4 py-2 text-sm font-medium text-white
                          cursor-not-allowed opacity-70"
              >
                Apply
              </button>
              {/* Hover Text */}
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2
                          whitespace-nowrap rounded-md bg-black px-3 py-1 text-xs text-white
                          opacity-0 group-hover:opacity-100 transition"
              >
                Login to apply
              </span>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobResults;
