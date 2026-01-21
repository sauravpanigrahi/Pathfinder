import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Companysignup = () => {
  const [company, setCompany] = useState(null);
  const [setup, setSetup] = useState(1); // Step tracker
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    workEmail: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
    locations: "",
    description: "",
    contactNumber: "", // Changed from contactNumber to match input name
    foundedYear: "",
    linkedinURL: "",
    address: "",
    logoURL:"",
    coverImageURL:""
  });

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Transportation",
    "Energy",
    "Aerospace",
    "Agriculture",
    "Automotive",
    "Chemical",
    "Entertainment",
    "Food & Beverage",
    "Media",
    "Real Estate",
    "Telecommunications",
    "Other"
  ];

  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001-5000 employees",
    "5001+ employees"
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialMedia.")) {
      const platform = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        socialMedia: {
          ...prevData.socialMedia,
          [platform]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  function generateUID() {
    const uid = uuidv4(); // Generates a unique UUID like '3b241101-e2bb-4255-8caf-4136c566a962'
    console.log("company UID:",uid);
    return uid;
  }
  // Step 1 submit
  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.workEmail || !formData.password) {
      toast.warning("Please fill all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    setSetup(2);
  };

  // Final submit
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      const companyID = generateUID();
      // Prepare payload for backend
      const payload = {
        uid: companyID,
        ...formData
      };
      // Updated axios configuration
      const response = await axios.post(
        "http://localhost:8000/company/signup",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      if (response.status === 200) {
        localStorage.setItem("company", JSON.stringify(response.data.companyName));
        localStorage.setItem("company UID", companyID);
        toast.success("Company registered successfully!");
        navigate("/companyhome");
      } else {
        throw new Error(response.data.detail || "Registration failed");
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error(error.response?.data?.detail || error.message || "Registration failed");
    }
  };

  return (
     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
         
        <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">   
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Register Your Company
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-600">
            Company Account Signup
          </h2>
          <p className="text-gray-600 text-sm">
            Join our platform and connect with top talent worldwide.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              setup === 1 ? "bg-indigo-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full ${
              setup === 2 ? "bg-indigo-600" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {setup === 1 ? (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  placeholder="Work Email"
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <button
                type="button"
                onClick={handleNext}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Next
              </button>

               <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>

              {/* Google Signup */}
              <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>

              {/* Social Signups */}
              {/* <div className="flex flex-wrap gap-3 justify-center mb-6">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                  <i className="ri-linkedin-fill text-blue-600"></i> LinkedIn
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                  <i className="ri-github-fill"></i> GitHub
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                  <i className="ri-facebook-circle-fill text-blue-500"></i> Facebook
                </button>
              </div> */}
             <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">
                Already have an account?{" "}
                <a
                  href="/login/Company"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  Log In
                </a>
              </span>
              </div>
            </div>
           
          ) : (
            <div className="space-y-4">
              {/* Company Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="relative">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full px-3 py-3 pl-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                </div>
                <div className="relative">
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber} // Changed from contactNumber to phoneNumber
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-3 py-3 pl-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                </div>
                <div className="relative">
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Company Website"
                  className="w-full px-3 py-3 pl-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                </div>
                <div className="relative">
                <input
                  type="text"
                  name="locations"
                  value={formData.locations}
                  onChange={handleChange}
                  placeholder="Office Locations"
                  className="w-full px-3 py-3 pl-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                </div>
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-3 py-3 pl-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Industry</option>
                  {industryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-2 py-3 pl-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Company Size</option>
                  {companySizeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="relative">
                <input
                  type="text"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  placeholder="Founded Year"
                  className="w-full px-2 py-3 pl-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                </div>
                <div className="relative">
                  <input
                  type="url"
                  name="socialMedia.linkedin"
                  value={formData.linkedinURL}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="w-full px-2 py-3 pl-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                </div>
              </div>
              <div className="space-y-4">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Company Description"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Company Address"
                  rows="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
                
              </div>
            
              {/* Social Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="url"
                  name="logoURL"
                  value={formData.logoURL}
                  onChange={handleChange}
                  placeholder="Logo URL"
                  className="w-full px-3 py-3 pl-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <input
                  type="url"
                  name="coverImageURL"
                  value={formData.coverImageURL}
                  onChange={handleChange}
                  placeholder="Cover Image URL"
                  className="w-full px-3 py-3 pl-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Text Areas */}
              
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setSetup(1)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"

                >
                  Complete Registration
                </button>
              </div>
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
  );
};

export default Companysignup;
