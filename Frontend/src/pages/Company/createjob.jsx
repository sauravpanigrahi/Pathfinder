import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Back from "../../components/backbutton"

const jobTitles = [
  "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "DevOps Engineer", "Data Scientist", "Machine Learning Engineer", "AI Engineer",
  "Cloud Architect", "Systems Administrator", "UI/UX Designer", "Product Manager",
  "QA Engineer", "Mobile App Developer", "Blockchain Developer", "Project Manager",
  "Business Analyst", "Product Owner", "Operations Manager", "Marketing Manager",
  "Sales Manager", "Account Manager", "HR Manager", "Financial Analyst",
  "Graphic Designer", "Content Writer", "Digital Marketing Specialist", "SEO Specialist",
  "Video Editor", "Content Strategist", "Data Analyst", "Cybersecurity Engineer",
  "Network Engineer", "Solutions Architect", "Technical Writer", "Scrum Master"
];

const technicalSkills = {
  "Programming Languages": [
    "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go",
    "TypeScript", "Rust", "Scala", "R", "MATLAB", "Perl", "Haskell", "Dart"
  ],
  "Web Technologies": [
    "React.js", "Angular", "Vue.js", "Node.js", "Express.js", "HTML5", "CSS3", 
    "Next.js", "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel",
    "Bootstrap", "Tailwind CSS", "jQuery", "WebGL", "GraphQL", "REST APIs"
  ],
  "Databases": [
    "MongoDB", "MySQL", "PostgreSQL", "Oracle", "Redis", "Elasticsearch",
    "SQLite", "Microsoft SQL Server", "Firebase", "Cassandra", "DynamoDB",
    "MariaDB", "Neo4j", "Couchbase"
  ],
  "Cloud & DevOps": [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git",
    "Terraform", "Ansible", "CircleCI", "Travis CI", "GitHub Actions", "ECS",
    "Prometheus", "Grafana", "nginx", "Linux", "Shell Scripting"
  ],
  "AI & Data Science": [
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Analysis",
    "Scikit-learn", "Pandas", "NumPy", "OpenCV", "NLP", "Computer Vision",
    "Neural Networks", "Big Data", "Apache Spark", "Hadoop", "NLTK"
  ],
  "Mobile Development": [
    "iOS Development", "Android Development", "React Native", "Flutter",
    "Xamarin", "SwiftUI", "Kotlin Multiplatform", "Ionic", "Mobile UI/UX",
    "App Store Optimization", "Mobile Security", "Mobile Analytics"
  ],
  "Security": [
    "Cybersecurity", "Penetration Testing", "Cryptography", "Security Auditing",
    "OAuth", "JWT", "OWASP", "Network Security", "Ethical Hacking",
    "Security Protocols", "Vulnerability Assessment"
  ]
};

const CreateJob = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem('company UID');

  useEffect(() => {
    if (!uid) {
      toast.error("Please login first");
      navigate('/login/Company');
      return;
    }
  }, [uid, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    skills: [],
    description: '',
    status: 'Active',
    posted: new Date().toISOString().split('T')[0],
  });

  const [skillInput, setSkillInput] = useState('');
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [titleSearch, setTitleSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(technicalSkills)[0]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    { id: 1, name: 'Basic Info', icon: '📋' },
    { id: 2, name: 'Details', icon: '💼' },
    { id: 3, name: 'Skills', icon: '🛠️' },
    { id: 4, name: 'Description', icon: '📝' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSkillSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.company || !formData.location) {
        toast.error("Please fill all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.type || !formData.salary) {
        toast.error("Please fill all required fields");
        return;
      }
    } else if (currentStep === 3) {
      if (formData.skills.length === 0) {
        toast.error("Please add at least one skill");
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.description.trim()) {
        toast.error("Please add a job description");
        return;
      }
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!uid) {
        toast.error('Please login first');
        navigate('/login/Company');
        return;
      }

      const skillsDict = {
        technicalSkills: formData.skills
      };

      const jobData = {
        title: formData.title,
        uid: uid,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        posted: new Date().toISOString().split('T')[0],
        status: 'Active',
        skills: skillsDict,
        description: formData.description
      };

      const response = await axios.post(
        `https://pathfinder-maob.onrender.com/jobs/${uid}/create`,
        jobData,
        { 
          headers: { 'Content-Type': 'application/json' }
        }
      );

      toast.success('Job posted successfully!');
      navigate('/companyhome');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'Failed to post job');
    }
  };

  const filteredTitles = jobTitles.filter(title =>
    title.toLowerCase().includes(titleSearch.toLowerCase())
  );

  return (
    <div>
    <Back/>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      
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
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-block p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">💼</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Job Posting</h1>
          <p className="text-gray-600 text-lg">Fill in the details to attract the best talent</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className="flex flex-col items-center transition-all duration-300"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-lg text-2xl ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-4 ring-indigo-200 scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-400 border-2 border-gray-300'
                      }`}
                    >
                      {isCompleted ? '✓' : step.icon}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-indigo-600 font-bold' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-4">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 text-2xl">
                    📋
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Job Title */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={titleSearch}
                      onChange={(e) => {
                        setTitleSearch(e.target.value);
                        setFormData({ ...formData, title: e.target.value });
                        setShowTitleSuggestions(true);
                      }}
                      onFocus={() => setShowTitleSuggestions(true)}
                      placeholder="e.g., Full Stack Developer"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      required
                    />
                    {showTitleSuggestions && titleSearch && (
                      <div className="absolute z-10 w-full mt-2 bg-white shadow-xl rounded-xl border border-gray-200 max-h-60 overflow-auto">
                        {filteredTitles.map((title) => (
                          <div
                            key={title}
                            className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setTitleSearch(title);
                              setFormData({ ...formData, title });
                              setShowTitleSuggestions(false);
                            }}
                          >
                            {title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Remote, New York, San Francisco"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 text-2xl">
                    💼
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Salary Range <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="e.g., $50,000 - $70,000"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-2xl">
                    🛠️
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Required Skills</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <select
                      className="block w-1/3 rounded-xl border-2 border-gray-200 py-3 px-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {Object.keys(technicalSkills).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="relative w-2/3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => {
                          setSkillInput(e.target.value);
                          setShowSkillDropdown(true);
                        }}
                        onFocus={() => setShowSkillDropdown(true)}
                        className="block w-full rounded-xl border-2 border-gray-200 py-3 px-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                        placeholder={`Search ${selectedCategory} skills`}
                      />
                      {(showSkillDropdown || skillInput) && (
                        <div className="absolute z-10 w-full mt-2 bg-white shadow-xl rounded-xl border-2 border-gray-200 max-h-60 overflow-auto">
                          <div className="sticky top-0 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
                            {skillInput ? 'Matching Skills' : 'Popular Skills'}
                          </div>
                          {(skillInput ? 
                            technicalSkills[selectedCategory].filter(skill => 
                              skill.toLowerCase().includes(skillInput.toLowerCase())
                            ) : 
                            technicalSkills[selectedCategory].slice(0, 8)
                          ).map((skill) => (
                            <div
                              key={skill}
                              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0 transition-colors"
                              onClick={() => handleSkillSelect(skill)}
                            >
                              <span>{skill}</span>
                              {!formData.skills.includes(skill) && (
                                <span className="text-xs text-indigo-600 font-medium">+ Add</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Skills ({formData.skills.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(index)}
                              className="ml-2 text-indigo-600 hover:text-indigo-900 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Description */}
            {currentStep === 4 && (
              <div className="animate-slide-in">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 text-2xl">
                    📝
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Describe the role and requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="8"
                    placeholder="Write a detailed job description including responsibilities, requirements, and what makes this role exciting..."
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 transition-all outline-none resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">{formData.description.length} characters</p>
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
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>✓</span>
                  <span>Post Job</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>🔒 Your job posting will be reviewed and published shortly</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateJob;
