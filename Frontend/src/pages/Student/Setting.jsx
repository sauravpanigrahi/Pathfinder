import React, { useEffect, useState, useMemo } from 'react';

import {AccountCircle,Lock,Notifications,Settings, Edit,Save,Cancel,Upload, Visibility,VisibilityOff,Phone,CalendarToday,LocationOn,School,LinkedIn,GitHub,Send} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil,Trash,Bookmark, Book  } from 'lucide-react';
import timeAgo from '../../js/Time';
import JobCard from '../../components/JobCard';
import { useAppContext } from '../../AppContext';

const Setting = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Appliedjobs,setAppliedjobs]= useState([]);
  const [userprojects,setUserprojects]= useState([]);
  const userID = localStorage.getItem("userUID");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [addproj,setaddproj]= useState(false);
  const [addexp,setaddexp]= useState(false);
  const { resume } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const [editingexperienceId, setEditingexperienceId] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [editExperienceData, setEditExperienceData] = useState({
      company_name: "",
      role: "",
      duration: "",
      description: ""
    });
  // const [addexperience,setaddexperience]= useState([]);
  const [userExperience,setuserExperience]= useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [savejob,setSavdjob]= useState([]);
  const [editProjectData, setEditProjectData] = useState({
  Title: "",
  description: "",
  tech_stack: "",
  link: ""
});

  const [profileData, setProfileData] = useState({
    id: '',
    uid: '',
    name: '',
    email: '',
    details: {
      id: '',
      phone_number: '',
      date_of_birth: '',
      address: '',
      bio: '',
      qualification: '',
      graduation_year: '',
      college_university: '',
      linkedin_url: '',
      github_url: '',
      profile_picture:""
    },
  
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });
  const sidebarItems = [
    { id: 'profile', label: 'Account', icon: AccountCircle },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appliedjob', label: 'Applied Job', icon: Send },
    { id: 'savedjob', label: 'Saved Jobs', icon: Bookmark },
    { id: 'logout', label: 'Logout', icon: LogoutIcon },
    
  ];

  const [projects, setProjects] = useState([
    { title: '', description: '', tech_stack: '', link: '' }
  ]);

  const [experiences, setExperiences] = useState([
    { company: '', role: '', duration: '', description: '' }
  ]);
  
  const addProject = () => {
    setaddproj(true);
    setProjects([...projects, { title: '', description: '', tech_stack: '', link: '' }]);
  };

  const addExperience = () => {
  setaddexp(true);
  setExperiences([{ company: '', role: '', duration: '', description: '' }]);
};


  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        if (!userID) {
          toast.error("Please login first");
          navigate("/login/student");
          return;
        }

        const profileRes = await axios.get(`https://pathfinder-maob.onrender.com/profile/${userID}`, {
          withCredentials: true,
        });
        console.log(profileRes.data)
        const { details, ...userInfo } = profileRes.data;
        setProfileData({
          ...userInfo,
          details,
        });
        localStorage.setItem(
          "studentProfile",
          JSON.stringify({
            ...userInfo,
            details,
          })
        );
        const jobsRes = await axios.get(`https://pathfinder-maob.onrender.com/jobs/appliedjobs/${userID}`, {
          withCredentials: true,
        });
        setAppliedjobs(jobsRes.data);
        const projectRes=await axios.get(`https://pathfinder-maob.onrender.com/project/${userID}`, {
          withCredentials: true,
        });
        setUserprojects(projectRes.data);
        const experienceRes=await axios.get(`https://pathfinder-maob.onrender.com/experience/${userID}`, {
          withCredentials: true,
        });
        setuserExperience(experienceRes.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        if (error.response?.status === 401) {
          navigate("/login/student");
        }
      }finally{
        setLoading(false);
      }
    };
    

    const timer = setTimeout(() => {
      checkAuthAndFetchData();
    }, 2000);
    return () => clearTimeout(timer);
  }, [userID, navigate]);
useEffect(() => {
  const fetchSavedJob = async () => {
    try {
      const savedjobres = await axios.get(
        `https://pathfinder-maob.onrender.com/bookmarks/user/${userID}`,
        { withCredentials: true }
      );
      setSavdjob(savedjobres.data);
      console.log("Saved jobs fetched:", savedjobres.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
    }
  };

  if (userID) {
    fetchSavedJob();
  }
}, [userID]);

const totalPages = Math.ceil(savejob.length / jobsPerPage);
const paginatedJobs = useMemo(() => {
  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  return savejob.slice(start, end);
}, [savejob, currentPage]);

const sortedPaginatedJobs = useMemo(() => {
  return [...paginatedJobs].sort(
    (a, b) => (b.match_percentage || 0) - (a.match_percentage || 0)
  );
}, [paginatedJobs]);

const topMatchId = sortedPaginatedJobs[0]?.id;


  const submitprojects = (e) => {
    e.preventDefault();
    axios.post(`https://pathfinder-maob.onrender.com/project/add/${userID}`,{
          projects: projects.map((p) => ({
            stud_uid: userID,
            Title: p.title,
            description: p.description,
            tech_stack: p.tech_stack,
            link: p.link || null
          }))
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then((response) => {
        toast.success("Projects submitted successfully ✅");
        setUserprojects((prev) => [
        ...prev,
        ...projects.map((p) => ({
          Title: p.title,
          description: p.description,
          tech_stack: p.tech_stack,
          link: p.link || null
        }))
      ]);
        setProjects([{ title: '', description: '', tech_stack: '', link: '' }]);
        setaddproj(false);
      })
      .catch((error) => {
        console.error("Error submitting projects:", error.response?.data || error);
        toast.error("Failed to submit projects ❌");
      });
  };
const submitExperience = (e) => {
  e.preventDefault();

  axios.post(
    `https://pathfinder-maob.onrender.com/experience/add/${userID}`,
    {
      experiences: experiences.map((exp) => ({
        company_name: exp.company,
        role: exp.role,
        duration: exp.duration,
        description: exp.description
      }))
    },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    }
  )
  .then(() => {
    toast.success("Experience submitted successfully ✅");

    // ✅ UPDATE UI IMMEDIATELY
    setuserExperience((prev) => [
      ...prev,
      ...experiences.map((exp) => ({
        company_name: exp.company,
        role: exp.role,
        duration: exp.duration,
        description: exp.description
      }))
    ]);

    // reset form
    setExperiences([{ company: '', role: '', duration: '', description: '' }]);
    setaddexp(false);
  })
  .catch((error) => {
    console.error("Error submitting experience:", error.response?.data || error);
    toast.error("Failed to submit experience ❌");
  });
};

const updateproject = (e, id) => {
  e.preventDefault();

  axios.put(
    `https://pathfinder-maob.onrender.com/project/update/${userID}/${id}`,
    editProjectData,
    {
      headers: { "Content-Type": "application/json" }
    }
  )
  .then(() => {
    toast.success("Project updated successfully ✅");

    // update UI instantly
    setUserprojects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...editProjectData } : p
      )
    );

    setEditingProjectId(null);
  })
  .catch((error) => {
    console.error(error.response?.data);
    toast.error("Failed to update project ❌");
  });
};
const updateExperience = (e, id) => {
  e.preventDefault();
  axios.put(
    `https://pathfinder-maob.onrender.com/experience/update/${userID}/${id}`,
    editExperienceData,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }
  )
  .then(() => {
    toast.success("Experience updated successfully ✅");
    // update UI instantly
    setuserExperience((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, ...editExperienceData } : exp
      )
    );
    setEditingexperienceId(null);
  })
  .catch((error) => {
    console.error(error.response?.data);
    toast.error("Failed to update experience ❌");
  });
};
const deleteproj=async (id)=>{
  try{
    const deleteres=await axios.delete(`https://pathfinder-maob.onrender.com/project/delete/${userID}/${id}`,{
      withCredentials: true,
  })
    toast.success("Project deleted successfully ✅");
     setUserprojects((prev) =>
      prev.filter((project) => project.id !== id)
    );

}catch(error){
    console.error("Error deleting project:", error);
    toast.error("Failed to delete project ❌");
}
}
const deleteexp=async (id)=>{
  try{
    const deleteres=await axios.delete(`https://pathfinder-maob.onrender.com/experience/delete/${userID}/${id}`,{
      withCredentials: true,
  })

    toast.success("Experience deleted successfully ✅");
      setuserExperience((prev) =>
      prev.filter((exp) => exp.id !== id)
    );
}catch(error){

    console.error("Error deleting experience:", error);
    toast.error("Failed to delete experience ❌");
}}
const updateProfile = async () => {
  try {
    const formData = new FormData();

    // -------- BASIC INFO --------
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);

    // -------- DETAILS --------
    formData.append("phone_number", profileData.details.phone_number);
    formData.append("date_of_birth", profileData.details.date_of_birth);
    formData.append("address", profileData.details.address);
    formData.append("bio", profileData.details.bio);
    formData.append("qualification", profileData.details.qualification);
    formData.append("graduation_year", profileData.details.graduation_year);
    formData.append("college_university", profileData.details.college_university);
    formData.append("linkedin_url", profileData.details.linkedin_url);
    formData.append("github_url", profileData.details.github_url);

    // -------- PROFILE IMAGE --------
    if (profileImageFile) {
      formData.append("profile_picture", profileImageFile);
    }

    await axios.put(
      `https://pathfinder-maob.onrender.com/profile/update/${userID}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    toast.success("Profile updated successfully ✅");
    setIsEditing(false);
  } catch (error) {
    console.error(error.response?.data || error);
    toast.error("Failed to update profile ❌");
  }
};

 const handleProfileChange = (field, value, isDetail = false) => {
  if (isDetail) {
    setProfileData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  } else {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }
};

  const handleSaveProfile = () => {
  updateProfile();
};
 const handleSecurityChange = (field, value) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if(!file) return;
    setProfileImageFile(file)
    setProfileImagePreview(URL.createObjectURL(file))
  }
  const handleSaveSecurity = async () => {
    // Validation
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (securityData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.put(
        "https://pathfinder-maob.onrender.com/student/password/update",
        {
          current_password: securityData.currentPassword,
          new_password: securityData.newPassword,
          confirm_password: securityData.confirmPassword
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Password updated successfully!");
        setSecurityData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorEnabled: securityData.twoFactorEnabled
        });
      }
    } catch (error) {
      console.error("Password update error:", error);
      const errorMessage = error.response?.data?.detail || "Failed to update password. Please try again.";
      toast.error(errorMessage);
    }
  };

 const Logoutsetting = async () => {
  try {
    await axios.post(
      "https://pathfinder-maob.onrender.com/student/logout",
      {},
      { withCredentials: true }
    );

    localStorage.clear();
    toast.success("Logout successful");
    navigate('/');
  } catch (error) {
    console.error(error);
    toast.error("Logout failed");
  }
};


  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-xl">
                {profileImagePreview || profileData.details.profile_picture ? (
                      <img
                        src={profileImagePreview || profileData.details.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AccountCircle className="w-16 h-16 text-white" />
)}

              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-50 transition-all shadow-lg">
                  <Upload className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">{profileData.name || 'Your Name'}</h2>
              <p className="text-blue-100 text-sm">@{profileData.name || 'username'}</p>
              <p className="text-blue-100 text-sm mt-1">User ID: {userID}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
                >
                  <Cancel className="w-5 h-5" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AccountCircle className="w-6 h-6 text-blue-600" />
            Basic Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Name *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email *</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={profileData.details.phone_number}
                onChange={(e) =>handleProfileChange("phone_number", e.target.value, true)}
                disabled={!isEditing}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarToday className="w-4 h-4 text-blue-600" />
                Date of Birth *
              </label>
              <input
                type="date"
                value={profileData.details.date_of_birth}
                onChange={(e) => handleProfileChange('date_of_birth', e.target.value,true)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <LocationOn className="w-4 h-4 text-blue-600" />
              Address *
            </label>
            <textarea
              value={profileData.details.address}
              onChange={(e) =>
              handleProfileChange("address", e.target.value, true)}
              disabled={!isEditing}
              rows={3}
              placeholder="Enter your complete address"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all resize-none"
            />
          </div>
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Bio</label>
            <textarea
              value={profileData.details.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value,true)}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Academic Information Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <School className="w-6 h-6 text-purple-600" />
            Academic Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Highest Qualification *</label>
              <input
                value={profileData.details.qualification}
                onChange={(e) => handleProfileChange('qualification', e.target.value,true)}
                disabled={!isEditing}
                placeholder="e.g., B.Tech, M.Tech, MBA"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Graduation Year *</label>
              <input
                value={profileData.details.graduation_year}
                onChange={(e) => handleProfileChange('graduation_year', e.target.value,true)}
                disabled={!isEditing}
                placeholder="e.g., 2024"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">College/University *</label>
            <input
              type="text"
              value={profileData.details.college_university}
              onChange={(e) => handleProfileChange('college_university', e.target.value,true)}
              disabled={!isEditing}
              placeholder="Enter your college or university name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>
      </div>

      {/* Social Links Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Social Links</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <LinkedIn className="w-4 h-4 text-blue-700" />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profileData.details.linkedin_url}
                onChange={(e) => handleProfileChange('linkedin_url', e.target.value,true)}
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <GitHub className="w-4 h-4 text-gray-800" />
                GitHub URL
              </label>
              <input
                type="url"
                value={profileData.details.github_url}
                onChange={(e) => handleProfileChange('github_url', e.target.value,true)}
                disabled={!isEditing}
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Projects
            </h3>
            <p className="text-sm text-gray-600 mt-1">Showcase your best work and achievements</p>
          </div>
          <button
            onClick={addProject}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </div>

        {userprojects.length === 0 && !addproj && (
          <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">No Projects Yet</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building your portfolio by adding your first project.
            </p>
          </div>
        )}

        {userprojects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {userprojects.map((project, index) => {
            const isEditing = editingProjectId === project.id;

            return (
              <div
                key={project.id || index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                {/* ================= VIEW MODE ================= */}
                {!isEditing && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                          {project.Title || "Untitled Project"}
                        </h4>

                        {project.tech_stack && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.tech_stack.split(",").map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                        setEditingProjectId(project.id);
                        setEditProjectData({
                          Title: project.Title,
                          description: project.description,
                          tech_stack: project.tech_stack,
                          link: project.link || ""
                        });
                      }}

                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={18} />
                      </button>
                      <button onClick={()=> deleteproj(project.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash size={18} />
                      </button>
                    </div>

                    {project.description && (
                      <p className="text-gray-700 text-sm mb-4">
                        {project.description}
                      </p>
                    )}

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-semibold"
                      >
                        View Project →
                      </a>
                    )}
                  </>
                )}

                {/* ================= EDIT MODE ================= */}
                {isEditing && (
                  <form onSubmit={(e) => updateproject(e, project.id)} className="space-y-4">

                <input
                  type="text"
                  value={editProjectData.Title}
                  onChange={(e) =>
                    setEditProjectData({ ...editProjectData, Title: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

                <textarea
                  value={editProjectData.description}
                  onChange={(e) =>
                    setEditProjectData({ ...editProjectData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2"
                />

                <input
                  type="text"
                  value={editProjectData.tech_stack}
                  onChange={(e) =>
                    setEditProjectData({ ...editProjectData, tech_stack: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

                <input
                  type="url"
                  value={editProjectData.link}
                  onChange={(e) =>
                    setEditProjectData({ ...editProjectData, link: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProjectId(null)}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>

                )}
              </div>
            );
          })}
        </div>
      )}

        

        {addproj && projects.map((project, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 mb-6 border-2 border-blue-300 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">New Project</h4>
                  <p className="text-xs text-gray-500">Fill in the project details</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const newProjects = projects.filter((_, i) => i !== index);
                  setProjects(newProjects);
                  if (newProjects.length === 0) setaddproj(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., E-commerce Platform"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tech Stack *</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB"
                    value={project.tech_stack}
                    onChange={(e) => handleProjectChange(index, 'tech_stack', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  placeholder="Describe your project..."
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Link</label>
                <input
                  type="text"
                  placeholder="https://github.com/username/project"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        ))}

        {addproj && projects.length > 0 && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setProjects([{ title: '', description: '', tech_stack: '', link: '' }]);
                setaddproj(false);
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                submitprojects(e);
                setaddproj(false);
              }}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Project
            </button>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Experience
            </h3>
            <p className="text-sm text-gray-600 mt-1">Highlight your professional journey</p>
          </div>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Experience
          </button>
        </div>

        <div className="space-y-6">
         {userExperience.length === 0 && !addexp && (
          <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">No experience Yet</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building your portfolio by adding your first experience.
            </p>
          </div>
        )}
        {userExperience.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {userExperience.map((experience, index) => (
              <div key={experience.id || index} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                {editingexperienceId !== experience.id ? (
  /* ================= VIEW MODE ================= */
  <>
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1 text-left">
      <h4 className="text-xl font-bold text-gray-900 mb-2">
        {experience.company_name || "Untitled experience"}
      </h4>

      <div className="flex flex-col gap-2 text-left">
        {experience.duration && (
          <span className="w-fit px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-semibold rounded-full border">
            {experience.duration}
          </span>
        )}

        {experience.role && (
          <span className="w-fit px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-semibold rounded-full border">
            {experience.role}
          </span>
        )}
      </div>
</div>


      {/* Edit Button */}
      <button
        onClick={() => {
          setEditingexperienceId(experience.id);
          setEditExperienceData({
            company_name: experience.company_name,
            role: experience.role,
            duration: experience.duration,
            description: experience.description
          });
        }}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        <Pencil size={18} />
      </button>
      <button  onClick={()=>deleteexp(experience.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
          <Trash size={18} />
        </button>
    </div>

    {experience.description && (
      <p className="text-gray-700 text-sm leading-relaxed">
        {experience.description}
      </p>
    )}
  </>
) : (
  /* ================= EDIT MODE ================= */
  <form
    onSubmit={(e) => updateExperience(e, experience.id)}
    className="space-y-4"
  >
    <input
      type="text"
      value={editExperienceData.company_name}
      onChange={(e) =>
        setEditExperienceData({
          ...editExperienceData,
          company_name: e.target.value
        })
      }
      className="w-full border rounded-lg px-3 py-2"
      placeholder="Company Name"
    />

    <input
      type="text"
      value={editExperienceData.role}
      onChange={(e) =>
        setEditExperienceData({
          ...editExperienceData,
          role: e.target.value
        })
      }
      className="w-full border rounded-lg px-3 py-2"
      placeholder="Role"
    />

    <input
      type="text"
      value={editExperienceData.duration}
      onChange={(e) =>
        setEditExperienceData({
          ...editExperienceData,
          duration: e.target.value
        })
      }
      className="w-full border rounded-lg px-3 py-2"
      placeholder="Duration"
    />

    <textarea
      rows={4}
      value={editExperienceData.description}
      onChange={(e) =>
        setEditExperienceData({
          ...editExperienceData,
          description: e.target.value
        })
      }
      className="w-full border rounded-lg px-3 py-2"
      placeholder="Description"
    />

    <div className="flex gap-3">
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Save
      </button>

      <button
        type="button"
        onClick={() => setEditingexperienceId(null)}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        Cancel
      </button>
    </div>
  </form>
)}

              </div>
            ))}
          </div>
        )}
          {addexp && experiences.map((exp, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{exp.company || exp.role || `Experience #${index + 1}`}</h4>
                    <p className="text-xs text-gray-500">{exp.duration || 'Duration not specified'}</p>
                  </div>
                </div>
                {experiences.length > 1 && (
                  <button
                    onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Razorpay"
                      value={exp.company || ""}
                      onChange={(e) =>
                        handleExperienceChange(index, "company", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                                focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role / Position *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Frontend Developer"
                      value={exp.role || ""}
                      onChange={(e) =>
                        handleExperienceChange(index, "role", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                                focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  
                </div>

                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                  <input
                    type="text"
                    placeholder="e.g., Jan 2022 - Present"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your responsibilities..."
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
          {addexp && (
          <button
            onClick={submitExperience}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold"
          >
            Save Experience
          </button>
        )}

        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Security Settings</h2>
        <p className="text-red-100">Manage your password and security preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={securityData.newPassword}
                onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={securityData.confirmPassword}
                onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            onClick={handleSaveSecurity}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-md"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
              <p className="text-gray-600 text-sm mt-1">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityData.twoFactorEnabled}
                onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
  const renderAppliedJobSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Applied Jobs</h2>
        <p className="text-cyan-100">Track your job applications</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {Appliedjobs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-100 rounded-full mb-4">
              <Send className="w-10 h-10 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Applications Yet</h3>
            <p className="text-gray-600">Start applying to jobs to see them here</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Appliedjobs.map((job) => (
                <div key={job.id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-cyan-300 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{job.Job_role}</h4>
                      <p className="text-sm text-gray-600">{job.Job_company}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status === 'accepted' ? '✓ Accepted' :
                       job.status === 'rejected' ? '✗ Rejected' :
                       '⏳ Pending'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <LocationOn className="w-4 h-4" />
                      {job.Job_location}
                    </p>
                    {job.applied_date && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <CalendarToday className="w-4 h-4" />
                        Applied: {new Date(job.applied_date).toLocaleDateString()}
                      </p>
                    )}
                    {job.match_percentage !== null && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Match Score</span>
                          <span className={`text-xs font-bold ${
                            job.match_percentage >= 75 ? 'text-green-600' :
                            job.match_percentage >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {job.match_percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              job.match_percentage >= 75 ? 'bg-green-500' :
                              job.match_percentage >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${job.match_percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
const renderSavedJobs = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
      <h2 className="text-3xl font-bold mb-2">Saved Jobs</h2>
      <p className="text-indigo-100">Jobs you bookmarked for later</p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {savejob.length === 0 ? (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
            <Bookmark className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Saved Jobs
          </h3>
          <p className="text-gray-600">
            Bookmark jobs to see them here
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPaginatedJobs.map((job) => 
            <JobCard 
              key={job.id} 
              job={job} 
              Resume={resume}  
              isTopMatch={job.id === topMatchId} 
            />
          )}
            </div> 
            </div>
      )}
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
  
);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'security': return renderSecuritySettings();
      // case 'notifications': return renderNotificationSettings();
      // case 'preferences': return renderPreferencesSettings();
      case 'appliedjob': return renderAppliedJobSettings();
      case 'savedjob': return renderSavedJobs();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sticky top-4">
              <nav className="space-y-1">
                {sidebarItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => id === 'logout' ? Logoutsetting() : setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all font-medium ${
                      activeTab === id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
                      