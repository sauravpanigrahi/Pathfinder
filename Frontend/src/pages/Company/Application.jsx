import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '/src/css/Loader.css';
import Resume from '../../components/Resume';
import { Loader } from "../../components/loader";

const Application = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const companyUID = localStorage.getItem('company UID');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/applications/${companyUID}`,
          { withCredentials: true }
        );
        const apps = response.data;
        
        const appsWithMatch = await Promise.all(
          apps.map(async (app) => {
            try {
              if (!app.match_percentage) {
                const matchRes = await axios.get(
                  `http://localhost:8000/applications/${app.id}/match-percentage`,
                  { withCredentials: true }
                );
                return { ...app, match_percentage: matchRes.data.match_percentage };
              }
              return app;
            } catch (err) {
              console.error(`Error calculating match for app ${app.id}:`, err);
              return { ...app, match_percentage: 0 };
            }
          })
        );
        
        setApplications(appsWithMatch);
      } catch (error) {
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    }
    fetchApplications(); 
  }, [companyUID]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8000/applications/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.detail || 'Failed to update application status');
    }
  };

  // ✅ SORT BY MATCH PERCENTAGE ASCENDING (LOWEST FIRST)
  const rankedApplications = useMemo(() => {
    return applications
      .sort((a, b) => {
        const matchA = a.match_percentage || 0;
        const matchB = b.match_percentage || 0;
        return matchB - matchA; // LOWEST to HIGHEST (ascending order)
      })
      .filter((app) =>
        app.Fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.Job_role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((app) => filter === 'all' || app.status === filter);
  }, [applications, searchTerm, filter]);

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending' || !app.status).length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Sorted by match percentage (lowest first). {stats.total} total applications.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-semibold text-amber-600">{stats.pending}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Pending</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-600">{stats.accepted}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Accepted</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-400">{stats.rejected}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Application List */}
        <div className="space-y-3">
          {rankedApplications.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No applications found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            rankedApplications.map((application, index) => (
              <ApplicationCard
                key={application.id}
                application={application}
                rank={index + 1}
                onStatusChange={handleStatusChange}
                navigate={navigate}
                companyUID={companyUID}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------- APPLICATION CARD ------------------------- */
const ApplicationCard = ({ application, rank, onStatusChange, navigate, companyUID }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Accepted</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Pending Review</span>;
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 75) return 'text-green-700 bg-green-50';
    if (percentage >= 50) return 'text-amber-700 bg-amber-50';
    return 'text-red-700 bg-red-50';
  };

  const matchPercentage = application.match_percentage;

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-medium text-gray-600">
                {application.Fullname?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {application.Fullname}
                </h3>
                {getStatusBadge(application.status)}
                {matchPercentage !== null && matchPercentage !== undefined && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getMatchColor(matchPercentage)}`}>
                    {matchPercentage}% Match
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{application.Job_role}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {application.Email}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {application.phonenumber}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Resume stud_uid={application.stud_uid} />
            
            {application.status === 'accepted' ? (
              <>
                <button
                  onClick={() => navigate(`/company/interview/schedule`)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => onStatusChange(application.id, 'rejected')}
                  className="p-2 text-gray-400 hover:text-red-600 focus:outline-none transition-colors"
                  title="Reject"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : application.status === 'rejected' ? (
              <button
                onClick={() => onStatusChange(application.id, 'accepted')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Reconsider
              </button>
            ) : (
              <>
                <button
                  onClick={() => onStatusChange(application.id, 'accepted')}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => onStatusChange(application.id, 'rejected')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
              <svg className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <InfoField label="Education" value={application.high_qualification} />
              <InfoField label="College" value={application.college} />
              <InfoField label="Graduation Year" value={application.graduation_year} />
              <InfoField label="Previous Company" value={application.prev_company || 'Fresher'} />
              <InfoField label="Job Location" value={application.Job_location} />
              <InfoField label="Company" value={application.Job_company} />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Why Interested
              </label>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                {application.why_join}
              </p>
            </div>

            {(application.linkedin_url || application.github_url) && (
              <div className="flex gap-3">
                {application.linkedin_url && (
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {application.github_url && (
                  <a
                    href={application.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------- INFO FIELD ------------------------- */
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </label>
    <p className="text-sm text-gray-900 font-medium">{value || 'Not provided'}</p>
  </div>
);

export default Application;
