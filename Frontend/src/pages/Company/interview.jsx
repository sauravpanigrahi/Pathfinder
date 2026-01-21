import React, { useState, useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaEnvelope, FaTimes, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import Application from './Application';
import BackBar from '../../components/backbutton';
const Interview = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const companyUID = localStorage.getItem('company UID');
  const [rescheduleDates, setRescheduleDates] = useState({});
const [reschedulingId, setReschedulingId] = useState(null);


  // Fetch interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get(
          `https://pathfinder-qkw1.onrender.com/interviews/company/${companyUID}`,
          { withCredentials: true }
        );
        console.log('Fetched interviews:', response.data);
        setInterviews(response.data || []);
      } catch (error) {
        // If endpoint doesn't exist yet, show empty state
        if (error.response?.status !== 404) {
          console.error('Error fetching interviews:', error);
        }
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (companyUID) {
      fetchInterviews();
    }
  }, [companyUID]);

//  console.log("interview=",interviews)
  
const handleStatusUpdate = async (interviewId, newStatus) => {
  try {
    const payload = { status: newStatus };

    // When submitting reschedule, status becomes SCHEDULED
    const newDate = rescheduleDates[interviewId];
    if (newDate) {
      payload.interview_datetime = newDate;
    }

    await axios.put(
      `https://pathfinder-qkw1.onrender.com/interviews/${interviewId}/status`,
      payload,
      { withCredentials: true }
    );

    setInterviews(prev =>
      prev.map(interview =>
        interview.id === interviewId
          ? {
              ...interview,
              status: newStatus,
              interview_datetime:
                payload.interview_datetime || interview.interview_datetime
            }
          : interview
      )
    );

    toast.success("Interview rescheduled successfully!");
  } catch (error) {
    toast.error("Failed to update interview");
  }
};

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'google_meet':
        return '🔵';
      case 'zoom':
        return '🔷';
      case 'offline':
        return '📍';
      default:
        return '📹';
    }
  };

  // Filter interviews
  const filteredInterviews = interviews.filter(interview => {
    const search = searchTerm.toLowerCase();

const matchesSearch =
  (interview.name || "").toLowerCase().includes(search) ||
  (interview.role || "").toLowerCase().includes(search);
    
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const interviewDate = new Date(interview.interview_datetime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') {
        return interviewDate.toDateString() === today.toDateString();
      }
      if (dateFilter === 'upcoming') {
        return interviewDate >= today;
      }
      if (dateFilter === 'past') {
        return interviewDate < today;
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
       <BackBar/>
      <div className="max-w-7xl mx-auto  py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
         
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Management</h1>
              <p className="text-gray-600">Schedule and manage candidate interviews</p>
            </div>
            <button
              onClick={()=>navigate(`/company/interview/schedule`,{
                state: {
                  companyUID,
                }
              })}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaPlus className="w-5 h-5" />
              Schedule Interview
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by candidate name or job role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaCalendarAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews found</h3>
              <p className="text-gray-600 mb-6">
                {interviews.length === 0 
                  ? "Get started by scheduling your first interview"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {interviews.length === 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Schedule Interview
                </button>
              )}
            </div>
          ) : (
            filteredInterviews.map((interview) => {
              const { date, time } = formatDateTime(interview.interview_datetime);
              return (
                <div
                  key={interview.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      {/* Left Section - Candidate Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-lg">
                              {interview.name.charAt(0) || 'C'}
                            </span>
                           
                          </div>
                           
                          <div>
                            <h1 className="text-xl font-bold text-gray-900">{interview.name}</h1>
                            <div className="flex  items-center gap-3 mb-2">
                              
                              <h3 className="text-md text-gray-900">
                                {interview.role|| 'Candidate'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(interview.status)}`}>
                                {interview.status}
                              </span>
                            </div>
                            {/* <p className="text-gray-600 font-medium mb-3">
                              {interview.application?.Job_role || 'Job Role'}
                            </p> */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="w-4 h-4 text-indigo-600" />
                                <span className="font-medium">{date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaClock className="w-4 h-4 text-indigo-600" />
                                <span className="font-medium">{time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getPlatformIcon(interview.platform)}</span>
                                <span className="font-medium capitalize">{interview.platform?.replace('_', ' ')}</span>
                              </div>
                            </div>
                            {interview.meeting_link && (
                              <div className="mt-3">
                                <a
                                  href={interview.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                >
                                  <FaVideo className="w-4 h-4" />
                                  Join Meeting
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex  gap-2 lg:items-start">
                        {interview.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => setReschedulingId(interview.id)}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm"
                            >
                              Reschedule
                            </button>

                            <button
                              onClick={() => handleStatusUpdate(interview.id, 'completed')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                            >
                              Hired
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(interview.id, 'cancelled')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {interview.status === 'completed' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(interview.id, 'cancelled')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                            >
                              Reject
                            </button>
                            
                          </>
                        )}
                       {reschedulingId === interview.id && (
                            <div className="flex flex-col gap-2">
                              <input
                                type="datetime-local"
                                value={rescheduleDates[interview.id] || ""}
                                onChange={(e) =>
                                  setRescheduleDates(prev => ({
                                    ...prev,
                                    [interview.id]: e.target.value
                                  }))
                                }
                                className="w-56 p-2 border rounded"
                              />

                              <button
                                  onClick={() => {
                                    handleStatusUpdate(interview.id, 'scheduled');
                                    setReschedulingId(null);
                                  }}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                                >
                                  Submit
                                </button>

                            </div>
                          )}
                        {interview.status === 'cancelled' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(interview.id, 'completed')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                            >
                              Mark Complete
                            </button>
                             <button
                              onClick={() => setReschedulingId(interview.id)}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm"
                            >
                              Reschedule
                            </button>

                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

     
      
    </div>
  );
};

export default Interview;

