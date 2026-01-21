import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const JobApplicationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userUID = localStorage.getItem("userUID");
  const { companyuid } = useParams();
  // console.log("companyUID:", companyuid);
  const { jobTitle, companyName, jobLocation } = location.state || {};

  const [formData, setFormData] = useState({
    stud_uid: userUID,
    comp_uid: companyuid,
    Job_role: jobTitle,
    Job_company: companyName,
    Job_location: jobLocation,
    Fullname: '',
    Email: '',
    phonenumber: '',
    Dob: '',
    high_qualification: '',
    college: '',
    graduation_year: '',
    prev_company: '',
    job_title: '',
    start_date: '',
    end_date: '',
    linkedin_url: '',
    github_url: '',
    why_join: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (!userUID) {
      toast.error("Please login first");
      navigate('/login/student');
    }
  }, [userUID, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );
      console.log("Submitting application:", formData);
      const response = await axios.post(
        "https://pathfinder-qkw1.onrender.com/student/apply",
        cleanedData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      console.log("Application response:", response.data);
      toast.success("Application Submitted Successfully");
      navigate('/listedjobs');
    } catch (err) {
      console.error("Error submitting application:", err.response?.data || err);
      toast.error(err.response?.data?.detail || "Failed to submit application");
    }
  };

 const nextStep = () => {
  if (currentStep === 1) {
    // Validate Personal Information
    if (!formData.Fullname || !formData.Email || !formData.phonenumber || !formData.Dob) {
      toast.error("Please fill all required personal details.");
      return;
    }
  } else if (currentStep === 2) {
    // Validate Education
    if (!formData.high_qualification || !formData.college || !formData.graduation_year) {
      toast.error("Please fill all required education details.");
      return;
    }
  } else if (currentStep === 4) {
    // Validate 'why_join' if needed (optional, because it’s already required)
    if (!formData.why_join.trim()) {
      toast.error("Please tell us why you want to join.");
      return;
    }
  }

  // If everything is fine, move to next step
  if (currentStep < 4) {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(currentStep + 1);
  }
};


  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const steps = [
    { id: 1, name: 'Personal', icon: '👤' },
    { id: 2, name: 'Education', icon: '🎓' },
    { id: 3, name: 'Experience', icon: '💼' },
    { id: 4, name: 'Additional', icon: '📄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-4 px-2">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-2 animate-fade-in">
          <div className="inline-block p-2 bg-indigo-600 rounded-2xl mb-2 shadow-lg">
            <span className="text-2xl">💼</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Application</h1>
          <p className="text-gray-600 text-lg">{jobTitle || 'Position'}</p>
          <p className="text-indigo-600 font-medium">{companyName || 'Company'}</p>
          <p className="text-gray-500">{jobLocation || 'Location'}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isActive ? 'scale-80' : 'scale-70'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-lg text-2xl ${
                        isActive
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-400 border-2 border-gray-300'
                      }`}
                    >
                      {isCompleted ? '✓' : step.icon}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                        completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-5 mb-2">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 text-2xl">
                    👤
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Fullname"
                      value={formData.Fullname}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleInputChange}
                      placeholder="+91 (555) 000-0000"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="Dob"
                      value={formData.Dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {currentStep === 2 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 text-2xl">
                    🎓
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Education Background</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Highest Qualification <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="high_qualification"
                      value={formData.high_qualification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      required
                    >
                      <option value="">Select qualification</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      College/University <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="Indian Institute of Technology"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      required
                    />
                  </div>
                  
                  <div className="form-group md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="graduation_year"
                      value={formData.graduation_year}
                      onChange={handleInputChange}
                      placeholder="2024"
                      min="1950"
                      max="2030"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Work Experience */}
            {currentStep === 3 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-2xl">
                    💼
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                </div>
                <p className="text-gray-500 mb-6 text-sm">Optional - Skip if you're a fresher</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Previous Company
                    </label>
                    <input
                      type="text"
                      name="prev_company"
                      value={formData.prev_company}
                      onChange={handleInputChange}
                      placeholder="Google Inc."
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleInputChange}
                      placeholder="Software Engineer"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 4 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 text-2xl">
                    🔗
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/johndoe"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 transition-all outline-none"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleInputChange}
                        placeholder="https://github.com/johndoe"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 transition-all outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Why do you want to join us? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="why_join"
                      value={formData.why_join}
                      onChange={handleInputChange}
                      placeholder="Share your motivation and what excites you about this opportunity..."
                      rows="6"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 transition-all outline-none resize-none"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">{formData.why_join.length} characters</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {steps.map(step => (
                  <div
                    key={step.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentStep === step.id ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>✓</span>
                  <span>Submit Application</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>🔒 Your information is secure and will only be used for recruitment purposes</p>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;