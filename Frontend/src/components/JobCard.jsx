import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import timeAgo from '../js/Time';
import { Bookmark } from 'lucide-react';
const JobCard = ({ job, Resume,isTopMatch  }) => {
    const navigate = useNavigate();
    const companyuid = job.uid;
    const userUID = localStorage.getItem("userUID");
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [showdetails, setShowDetails] = useState(false);
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [saved, setSaved] = useState(false);
    const toggleJobDetails = () => {
      setShowJobDetails(prev => !prev);
    };

    const toggleDetails = () => {
      setShowDetails(prev=>!prev);
    }
    // console.log("id",job.id)
    // ✅ Check application status
    useEffect(() => {
        const checkApplicationStatus = async () => {
            if (!userUID) {
                setLoadingStatus(false);
                return;
            }
          
            try {
                const response = await axios.get(
                    `https://pathfinder-maob.onrender.com/applications/check/${userUID}/${companyuid}/${encodeURIComponent(job.title)}/${encodeURIComponent(job.company)}/${encodeURIComponent(job.location)}`
                );
                console.log("Application status response:", response.data);
               
                    setApplicationStatus(response.data);
                console.log
                
            } catch (error) {
                console.error("Error checking application status:", error);
            } finally {
                setLoadingStatus(false);
            }
        };
        checkApplicationStatus();
    }, [userUID, companyuid, job.title, job.company, job.location]);

    const apply = () => {
        navigate(`/Student/Apply/${companyuid}`, {
            state: {
                jobTitle: job.title,
                companyName: job.company,
                jobLocation: job.location,
                
            }
        });
    }
    useEffect(() => {
  const checkSaved = async () => {
    if (!userUID) return;
    const res = await axios.get(
      `https://pathfinder-maob.onrender.com/bookmarks/check/${userUID}/${job.id}`
    );
    setSaved(res.data.saved);
  };
  checkSaved();
}, [userUID, job.id]);
const toggleBookmark = async () => {
  try {
    const res = await axios.post(
      "https://pathfinder-maob.onrender.com/bookmarks/toggle",
      {
        user_uid: userUID,
        job_id: job.id
      }
    );
    setSaved(res.data.saved);
  } catch (err) {
    console.error("Bookmark error", err);
  }
};


  //   const handleStatusChange = async (applicationId, newStatus) => {
  //   try {
  //     await axios.patch(
  //       `https://pathfinder-maob.onrender.com/applications/${applicationId}/status`,
  //       { status: newStatus },
  //       { withCredentials: true }
  //     );
  //     setApplications((prev) =>
  //       prev.map((app) =>
  //         app.id === applicationId ? { ...app, status: newStatus } : app
  //       )
  //     );
  //     toast.success(`Application ${newStatus} successfully!`);
  //   } catch (error) {
  //     console.error('Status update error:', error);
  //     toast.error(error.response?.data?.detail || 'Failed to update application status');
  //   }
  // };
    // useEffect(() => {
    //     console.log("🔁 resume state changed in jobcard.jsx:", Resume);
    //   }, [Resume]);
    // Helper function to convert skills object/array to array
    const getSkillsArray = (skills) => {
      if (Array.isArray(skills)) return skills;
      if (typeof skills === 'object') return Object.values(skills).flat();
      return [];
    };
    const smartreview=()=>{
      navigate(`/listedjobs/${companyuid}/smartreview/${job.id}`);
    }
      return (
        <>
    

       <div
  className={`group rounded-2xl bg-white p-3 shadow-sm hover:shadow-lg transition-all duration-200
    ${isTopMatch
      ? "border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
      : "border border-gray-200"}
  `}
>
          <div className="flex items-start justify-between gap-3 ">
        

            <div className="relative">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
              {job.title}
            </h3>

            {isTopMatch && (
              <span className="absolute -top-0 -right-30 z-10 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md animate-bounce">
                ⭐ Top Match
              </span>
            )}

            <p className="mt-1 text-sm text-gray-500">
              {job.company} • {job.location}
            </p>
          </div>

            <div className='flex gap-2'>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {job.status}
            </span>
            <button
                onClick={toggleBookmark}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                title={saved ? "Remove Bookmark" : "Save Job"}
              >
                <Bookmark
                  className={`w-5 h-5 transition ${
                    saved ? "fill-indigo-600 text-indigo-600" : "text-gray-500"
                  }`}
                />
              </button>

            </div>
          </div>
    
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">{job.type}</span>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">{job.salary}</span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300">{timeAgo(job.posted)}</span>
            
              <span
                className={`inline-flex items-center rounded-full  px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300 font-bold ${
                  job.match_percentage >= 75 ? "text-green-600" :
                  job.match_percentage >= 50 ? "text-yellow-600" :
                  "text-red-600"
                }`}
              >
                Match: {job.match_percentage}%
              </span>
            
          </div>
    
          <div className="mt-4 flex flex-wrap gap-2">
          {getSkillsArray(job.skills).slice(0,5).map((skill, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        {skill}
      </span>
    ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {/* ✅ Application Status Button */}
            {loadingStatus ? (
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-gray-300 px-2 py-2 text-sm font-medium text-gray-600 cursor-not-allowed">
                Loading...
              </button>
            ) : applicationStatus.status === 'accepted' ? (
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-green-600 px-2 py-2 text-sm font-medium text-white cursor-not-allowed">
                ✓ Accepted
              </button>
            ) : applicationStatus.status === 'pending' ? (
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-yellow-500 px-2 py-2 text-sm font-medium text-white cursor-not-allowed">
                ⏳ Pending
              </button>
            ) : applicationStatus.status === 'rejected' ? (
              <>
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-red-500 px-2 py-2 text-sm font-medium text-white cursor-not-allowed">
                ✗ Rejected
              </button>
              </>
            ) :applicationStatus.status === 'scheduled' ? (
              <>
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-green-600 px-2 py-2 text-sm font-medium text-white cursor-not-allowed">
                ✓ Interview Scheduled
              </button>
              <button onClick={toggleDetails} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-1 py-1 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors">
                View Details
              </button>
              </>
            ) : applicationStatus.status === 'rescheduled' ? (
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-green-600 px-2 py-2 text-sm font-medium text-white cursor-not-allowed">
                ✓ Interview Rescheduled
              </button>
            ) : applicationStatus.status === 'completed' ? (
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-green-600 px-2 py-2 text-sm font-medium text-white cursor-not-allowed">
                ✓ Interview Completed
              </button>
            ) :applicationStatus.status === 'cancelled' ? (
              <button disabled className="inline-flex items-center justify-center rounded-lg bg-green-600 px-2 py-2 text-sm font-medium text-white cursor-not-allowed">
                ✗  Interview Cancelled
              </button>
            ) : (
              <button 
                onClick={apply} 
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
              >
                Apply
              </button>
            )}
            <button
              disabled={!Resume}
              onClick={smartreview}
              className={`inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 transition-colors duration-200
              ${Resume ? "hover:bg-indigo-50 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            >
              Smart Review
            </button>
            <button
            onClick={toggleJobDetails}
            className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-2 py-2 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 transition"
              >
            View Job Details
          </button>

          </div>
        </div>
        {showJobDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {job.title}
                </h3>
                <button
                  onClick={toggleJobDetails}
                  className="text-gray-500 hover:text-red-500"
                >
                  ✖
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <b>Company:</b> {job.company}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <b>Location:</b> {job.location}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <b>Job Type:</b> {job.type}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <b>Salary:</b> {job.salary}
              </p>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getSkillsArray(job.skills).map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

                  {job.description && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Job Description
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

        {showdetails && (
          <div className="fixed top-40 left-1/2 z-50 w-[100%] max-w-md -translate-x-1/2 rounded-xl border bg-white p-5 shadow-xl">
            
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Interview Details
              </h3>
              <button
                onClick={toggleDetails}
                className="text-sm text-red-500 hover:bg-gray-300 rounded-md p-1 "
              >
                ✖
              </button>
            </div>

            <div className="text-sm text-gray-700 space-y-2">
              <p><b>Date:</b> 12 Aug 2025</p>
              <p><b>Time:</b>  AM</p>
              <p><b>Platform:</b> {applicationStatus.platform}</p>
              <p>
                <b>Link:</b>{" "}
                <a href={applicationStatus.meeting_link} className="text-blue-600 underline" target="_blank"
                  rel="noopener noreferrer">
                  {applicationStatus.meeting_link}
                </a>
              </p>
            </div>

          </div>
        )}


        </>
        
      );
     
    };
    

export default JobCard;