import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "/src/css/Loader.css";
import { Loader } from "../../components/loader";
import { timeAgo } from "../../js/Time";
const InstitutionHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyUID = localStorage.getItem("company UID"); // Ensure this matches your login save key
  const [recentApplied, setrecentApplied] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [stats, setStats] = useState({
    activeJobs: 0,
    applications: 0,
    interviews: 0,
    hired: 0,
  });

  // ✅ Check authentication and fetch applications
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!companyUID) {
          toast.error("Please login first");
          navigate("/login/company");
          return;
        }
        try {
          const response = await axios.get(
            `https://pathfinder-maob.onrender.com/applications/${companyUID}`,
            { withCredentials: true },
          );
          // console.log(response.data)
          setrecentApplied(response.data.applications || []);
        } catch (err) {
          console.error("Error fetching applications:", err);
          toast.error("Error loading applications");
        }
        try {
          const jobsRes = await axios.get(
            `https://pathfinder-maob.onrender.com/company/${companyUID}/jobs`,
            { withCredentials: true },
          );
          // console.log(jobsRes.data)
          setCompanyJobs(jobsRes.data || []);
        } catch (err) {
          console.error("Error fetching jobs:", err);
          toast.error("Error loading jobs");
        }
      } catch (err) {
        console.error("Auth error:", err);
        toast.error("Authentication error");
        navigate("/login/company");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => {
      checkAuth();
    }, 4000);
    return () => clearTimeout(timer);
  }, [companyUID, navigate]);

  if (loading) {
    return <Loader />;
  }
  const STATUS_ORDER = {
    pending: 0,
    rejected: 1,
    accepted: 2,
  };

  const sortedApplications = [...recentApplied].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Active Jobs"
            value={companyJobs.jobs?.length || 0}
            icon="📋"
            trend="+5%"
            color="bg-blue-500"
          />
          <StatCard
            title="Total Applications"
            value={recentApplied.length}
            icon="📝"
            trend="+12%"
            color="bg-green-500"
          />
          <StatCard
            title="Interviews Scheduled"
            value={companyJobs.scheduled}
            icon="🗓"
            trend="+3%"
            color="bg-purple-500"
          />
          <StatCard
            title="Positions Filled"
            value={companyJobs.Hired}
            icon="✅"
            trend="+2%"
            color="bg-orange-500"
          />
        </div>

        {/* Main Grid: Jobs + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Applications
                </h2>
                {recentApplied.length > 3 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    {showAll ? "Show less" : "View all"}
                  </button>
                )}
              </div>
              <ul className="divide-y divide-gray-200">
                {sortedApplications.length > 0 ? (
                  (showAll
                    ? sortedApplications
                    : sortedApplications.slice(0, 3)
                  ).map((application) => (
                    <JobListItem
                      key={application.id}
                      application={application}
                      onViewDetails={(app) => {
                        setSelectedApplication(app);
                        setShowModal(true);
                      }}
                    />
                  ))
                ) : (
                  <li className="p-6 text-center text-gray-500">
                    No applications yet
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <ActivityFeed applications={recentApplied} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Application Details
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApplication(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.Fullname}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.Email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.phonenumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Job Role</p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.Job_role}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.Job_company}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.Job_location}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Qualification
                  </p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.high_qualification}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">College</p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.college}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Graduation Year
                  </p>
                  <p className="text-lg text-gray-900">
                    {selectedApplication.graduation_year}
                  </p>
                </div>
                {selectedApplication.prev_company && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Previous Company
                    </p>
                    <p className="text-lg text-gray-900">
                      {selectedApplication.prev_company}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Why interested in joining?
                </p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {selectedApplication.why_join}
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                {selectedApplication.linkedin_url && (
                  <a
                    href={selectedApplication.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    LinkedIn Profile →
                  </a>
                )}
                {selectedApplication.github_url && (
                  <a
                    href={selectedApplication.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    GitHub Profile →
                  </a>
                )}
              </div>
              <div className="pt-4 border-t border-gray-200 flex gap-4">
                <button
                  onClick={() => navigate("/company/application")}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View All Applications
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedApplication(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------- STAT CARD ------------------------- */
const StatCard = ({ title, value, icon, trend, color }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div
        className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white`}
      >
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-500 font-medium">{trend}</span>
      <span className="text-gray-500 ml-2">vs last month</span>
    </div>
  </div>
);

/* ------------------------- JOB LIST ITEM ------------------------- */
const JobListItem = ({ application, onViewDetails }) => (
  <li className="p-6 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
            💼
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold">
            {application.Fullname || "Unknown Applicant"}
          </h3>
          <p className="text-gray-600">
            {application.Job_role || "No role specified"}
          </p>
          <p className="text-sm text-gray-500">
            {application.Email || "No email provided"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {application.status || "Pending"}
        </span>
        <button
          onClick={() => onViewDetails(application)}
          className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  </li>
);

/* ------------------------- ACTIVITY FEED ------------------------- */
const ActivityFeed = ({ applications = [] }) => {
  const sortedByRecent = [...applications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  return (
    <div className="flow-root">
      {sortedByRecent.length === 0 ? (
        <p className="text-center text-gray-500">No recent activity</p>
      ) : (
        <ul className="-mb-8">
          {sortedByRecent.map((item, itemIdx) => (
            <li key={item.id || itemIdx}>
              <div className="relative pb-8">
                {itemIdx !== sortedByRecent.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      📝
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        New application received for{" "}
                        <span className="font-medium text-gray-900">
                          {item.Job_role || "Unknown Role"}
                        </span>
                      </p>
                    </div>

                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={item.created_at}>
                        {timeAgo(item.created_at)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstitutionHome;
