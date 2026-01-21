import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEnvelope, FaTimes } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const Interviewschedule = () => {
    const navigate=useNavigate();
const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
const { state } = useLocation();
const companyUID =
  state?.companyUID || localStorage.getItem("company UID");
  const [formData, setFormData] = useState({
    application_id: "",
    student_uid: "",
    company_uid: companyUID,
    interview_datetime: "",
    platform: "google_meet",
    meeting_link: "",
    status: "scheduled",
    send_email: true,
    name: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
    setFormData((prev) => ({
      ...prev,
      application_id: application.id,
      student_uid: application.stud_uid,
      name: application.Fullname,      // ✅ ADD
      role: application.Job_role 
    }));
  };
   // Fetch accepted applications for scheduling
  useEffect(() => {
    const fetchAcceptedApplications = async () => {
      try {
        const response = await axios.get(
          `https://pathfinder-qkw1.onrender.com/applications/${companyUID}`,
          { withCredentials: true }
        );
        const acceptedApps = response.data.filter(app => app.status === 'accepted');
        setApplications(acceptedApps);
        console.log("accepted application",acceptedApps)
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to fetch applications');
      }
    };

    if (companyUID) {
      fetchAcceptedApplications();
    }
  }, [companyUID]);
console.log("application",applications)
  const handleScheduleInterview = async (e) => {
    e.preventDefault();

    if (!formData.interview_datetime) {
      toast.error("Please select interview date and time");
      return;
    }

    if (formData.platform !== "offline" && !formData.meeting_link) {
      toast.error("Please provide meeting link");
      return;
    }

    try {
      const payload = {
        ...formData,
        interview_datetime: new Date(
          formData.interview_datetime
        ).toISOString(),
      };

      await axios.post(
        "https://pathfinder-qkw1.onrender.com/interviews/schedule",
        payload,
        { withCredentials: true }
      );

      toast.success("Interview scheduled successfully");

      setSelectedApplication(null);
      setFormData({
        application_id: "",
        student_uid: "",
        company_uid: companyUID,
        interview_datetime: "",
        platform: "google_meet",
        meeting_link: "",
        status: "scheduled",
        send_email: true,
        name: "",
        role: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule interview");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Schedule Interview</h2>
          <button onClick={()=>navigate(-1)}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleScheduleInterview} className="p-6 space-y-6">
          {/* Candidate */}
          <select
            required
            value={formData.application_id}
            onChange={(e) => {
              const app = applications.find(
                (a) => a.id === Number(e.target.value)
              );
              handleApplicationSelect(app);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose candidate</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.Fullname} - {app.Job_role}
              </option>
            ))}
            
          </select>
        {selectedApplication && (
                        <div className="bg-gray-50 border rounded p-3 text-sm text-gray-700">
                            <p>
                            <span className="font-semibold">Candidate Email:</span>{" "}
                            {selectedApplication.Email}
                            </p>
                        </div>
        )}
          {/* Date */}
          <input
            type="datetime-local"
            name="interview_datetime"
            value={formData.interview_datetime}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Platform */}
          <select
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="google_meet">Google Meet</option>
            <option value="zoom">Zoom</option>
            <option value="offline">Offline</option>
          </select>

          {/* Meeting link */}
          {formData.platform !== "offline" && (
            <input
              type="url"
              name="meeting_link"
              value={formData.meeting_link}
              onChange={handleInputChange}
              placeholder="Meeting link"
              className="w-full p-2 border rounded"
            />
          )}

          {/* Email */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="send_email"
              checked={formData.send_email}
              onChange={handleInputChange}
            />
            <FaEnvelope /> Send email notification
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded">
            Schedule Interview
          </button>
        </form>
      </div>
    </div>
  );
};

export default Interviewschedule;
