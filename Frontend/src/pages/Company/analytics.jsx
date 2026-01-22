import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '/src/css/Loader.css';

const Analytics = () => {
  const navigate = useNavigate();
  const companyUID = localStorage.getItem('company UID');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!companyUID) {
        toast.error("Please login first");
        navigate('/login/Company');
        return;
      }

      try {
        const response = await axios.get(
          `https://pathfinder-maob.onrender.com/analytics/${companyUID}`,
          { withCredentials: true }
        );
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.response?.data?.detail || "Failed to load analytics data");
        toast.error("Error loading analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, [companyUID, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">AI-powered insights into your hiring performance</p>
          </div>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 text-lg mb-4">{error || "No analytics data available"}</p>
            <p className="text-gray-600 mb-6">Please check your connection and try again.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/companyhome')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { statistics, charts, job_field_ratio, status_breakdown } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">AI-powered insights into your hiring performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Applications"
            value={statistics.total_applications}
            icon="📝"
            color="bg-blue-500"
          />
          <StatCard
            title="Applications Accepted"
            value={statistics.applications_accepted}
            icon="✅"
            color="bg-green-500"
          />
          <StatCard
            title="Applications Pending"
            value={statistics.applications_pending}
            icon="⏳"
            color="bg-yellow-500"
          />
          <StatCard
            title="Interviews Scheduled"
            value={statistics.interviews_scheduled}
            icon="📅"
            color="bg-purple-500"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Applications Rejected"
            value={statistics.applications_rejected}
            icon="❌"
            color="bg-red-500"
          />
          <StatCard
            title="Students Hired"
            value={statistics.students_hired}
            icon="🎉"
            color="bg-green-500"
          />
          <StatCard
            title="Active Jobs"
            value={statistics.active_jobs}
            icon="📋"
            color="bg-indigo-500"
          />
          <StatCard
            title="Total Jobs Posted"
            value={statistics.total_jobs}
            icon="💼"
            color="bg-purple-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Application Status Pie Chart */}
          {charts.application_status_pie && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status Distribution</h2>
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${charts.application_status_pie}`}
                  alt="Application Status Pie Chart"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Application Status Bar Chart */}
          {charts.application_status_bar && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status Overview</h2>
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${charts.application_status_bar}`}
                  alt="Application Status Bar Chart"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Overview Chart */}
          {charts.overview_chart && (
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Statistics</h2>
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${charts.overview_chart}`}
                  alt="Overview Chart"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Job Field Ratio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Field Ratio Pie Chart */}
          {charts.job_field_ratio_pie && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Opening Field Ratio</h2>
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${charts.job_field_ratio_pie}`}
                  alt="Job Field Ratio Pie Chart"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Job Field Ratio Bar Chart */}
          {charts.job_field_ratio_bar && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Field Distribution</h2>
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${charts.job_field_ratio_bar}`}
                  alt="Job Field Ratio Bar Chart"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Breakdown Table */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Status Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(status_breakdown).map(([status, count]) => {
                  const percentage = statistics.total_applications > 0
                    ? ((count / statistics.total_applications) * 100).toFixed(1)
                    : '0.0';
                  return (
                    <tr key={status}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job Field Ratio Details */}
        {job_field_ratio && Object.keys(job_field_ratio).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Opening Field Ratio</h2>
            <div className="space-y-4">
              {Object.entries(job_field_ratio).map(([field, percentage]) => (
                <div key={field}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {field}
                    </span>
                    <span className="text-sm text-gray-600">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/companyhome')}
              className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium transition-colors"
            >
              View Dashboard →
            </button>
            <button
              onClick={() => navigate('/company/application')}
              className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors"
            >
              Manage Applications →
            </button>
            <button
              onClick={() => {
                const uid = localStorage.getItem('company UID');
                if (uid) {
                  navigate(`/companyhome/${uid}/create`);
                }
              }}
              className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors"
            >
              Create New Job →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------- STAT CARD COMPONENT ------------------------- */
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Analytics;
