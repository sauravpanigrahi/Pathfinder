import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from '../AppContext';


const Resume = ({stud_uid}) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [upload, setUpload] = useState(false);
  // ✅ FIX: When stud_uid is provided (from company viewing applications), 
  // always use that. Only use localStorage when component is used by student themselves.
  const userID = stud_uid || localStorage.getItem('userUID');
  const { resume,setResume } = useAppContext(); // <-- Fix: use setResume
  
  useEffect(() => {
    const checkResumeStatus = async () => {
      if (!userID) return;
      try {
        const res = await axios.get(`https://pathfinder-qkw1.onrender.com/resume/checkresume/${userID}`);
        if (res.data && res.data.uploaded) {
          setUpload(true);
          setResumeFile(res.data.url);
          setResume(true); // <-- Fix: use setResume
        } else {
          // ✅ Explicitly set to false if no resume found
          setUpload(false);
          setResumeFile(null);
        }
      } catch (error) {
        console.error("Error checking resume status:", error);
        // ✅ On error, assume no resume uploaded
        setUpload(false);
        setResumeFile(null);
      }
    };
    checkResumeStatus();
  }, [userID, setResume]);

  const resumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const response = await axios.post(
        `https://pathfinder-qkw1.onrender.com/resume/uploadresume/${userID}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // ✅ Update state immediately so button changes right away
      setResumeFile(response.data.url);
      setUpload(true);
      setResume(true);
      toast.success("Resume uploaded successfully ✅");
      console.log("Upload response:", response.data);
      
      // ✅ Re-check resume status to ensure consistency (optional, but good for reliability)
      // The state is already updated above, so this is just a verification
      setTimeout(async () => {
        try {
          const res = await axios.get(`https://pathfinder-qkw1.onrender.com/resume/checkresume/${userID}`);
          if (res.data && res.data.uploaded) {
            setResumeFile(res.data.url);
            setUpload(true);
            setResume(true);
          }
        } catch (error) {
          console.error("Error re-checking resume status:", error);
        }
      }, 500);
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume ❌");
      // ✅ Reset state on error
      setUpload(false);
      setResumeFile(null);
      setResume(false);
    }
  };

  // ✅ Check if this is company view (stud_uid provided) vs student view
  const isCompanyView = !!stud_uid;
  

  return (
    <div className="flex flex-col items-start space-y-3">
      {upload ? (
        < >
          {/* View Resume */}
          <button
            onClick={() => window.open(resumeFile, "_blank")}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            📄 View Resume
          </button>

          {/* Delete Resume */}
          
        </>

      ) : (
        <>
          {isCompanyView ? (
            // ✅ Company view: Show status text, no upload button
            <span className="inline-flex items-center gap-2 rounded-xl bg-yellow-50 border border-yellow-300 px-4 py-2 text-sm font-semibold text-yellow-700 shadow-sm">
              📄 Resume not uploaded
            </span>
          ) : (
            // ✅ Student view: Show upload button
            <label className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm cursor-pointer transition-colors duration-300">
              Resume Upload 📤
              <input type="file" className="hidden" onChange={resumeUpload} accept=".pdf" />
            </label>
          )}
        </>
      )}
    </div>
  );
};

export default Resume;
