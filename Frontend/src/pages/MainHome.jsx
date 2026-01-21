// export default MainHome;
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, FileCheck, BrainCircuit, Calendar, Video, Users, TrendingUp, Award, Briefcase, Search, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import Snowfall from 'react-snowfall'
import CTASection from '../components/cta';
import axios from 'axios';

const MainHome = () => {
  const [activeTab, setActiveTab] = useState('jobseeker');
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async() => {
  if (!query.trim()) return;
  // Redirect to jobs page with search query
  navigate(`/jobs?query=${encodeURIComponent(query)}`);
};
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <Snowfall
          color="rgba(255,255,255,0.7)"
          snowflakeCount={500}
          speed={[0.8, 1.5]}
          wind={[-0.5, 0.5]}
          radius={[0.8, 2.5]}
  />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Job Matching</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Job with <span className="text-blue-200">AI Intelligence</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Smart ATS scoring, AI resume optimization, and personalized job recommendations powered by advanced algorithms
            </p>

            {/* Search Bar */}
         <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={query}                         // ✅ added
                    onChange={(e) => setQuery(e.target.value)} // ✅ added
                    onKeyDown={handleKeyDown}             // ✅ added
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                
                <button
                  onClick={handleSearch}                  // ✅ added
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  Search Jobs
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>
            </div>
            <div className="mt-6 text-sm text-blue-100">
              Trending: <span className="text-white font-medium">AI Engineer, Product Manager, Data Scientist, UX Designer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Toggle */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white rounded-full p-1 shadow-md">
                <button
                  onClick={() => setActiveTab('jobseeker')}
                  className={`px-8 py-3 rounded-full font-semibold transition ${
                    activeTab === 'jobseeker'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  For Job Seekers
                </button>
                <button
                  onClick={() => setActiveTab('company')}
                  className={`px-8 py-3 rounded-full font-semibold transition ${
                    activeTab === 'company'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  For Companies
                </button>
              </div>
            </div>

            {/* Job Seeker Features */}
            {activeTab === 'jobseeker' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Sparkles className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI Job Recommendations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get personalized job suggestions powered by machine learning that match your skills, experience, and career goals perfectly.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <FileCheck className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">ATS Score Analysis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Know exactly how your resume scores with Applicant Tracking Systems. Get instant feedback and optimization tips.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Target className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">ATS-Matched Jobs</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Find jobs where your ATS score is highest. Apply to positions where you're most likely to pass initial screenings.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <BrainCircuit className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI Resume Builder</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create ATS-optimized resumes with AI-powered suggestions. Get real-time recommendations to improve your content.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Award className="w-7 h-7 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Interview Preparation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Practice with AI-generated interview questions tailored to your target role. Get feedback on your answers.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <TrendingUp className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Career Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track your application success rate, get insights on market trends, and optimize your job search strategy.
                  </p>
                </div>
              </div>
            )}

            {/* Company Features */}
            {activeTab === 'company' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <BrainCircuit className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI Candidate Matching</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Let AI analyze and rank candidates based on job requirements. Find the perfect match faster than ever.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <FileCheck className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Smart ATS Scoring</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Automatically score and filter candidates based on customizable criteria. Save hours on initial screening.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Video className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Integrated Video Interviews</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Schedule and conduct interviews directly through Google Meet and Zoom integration. Streamline your hiring process.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Calendar className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Interview Scheduling</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Automated calendar management with candidate availability matching. Reduce back-and-forth scheduling emails.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Users className="w-7 h-7 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Talent Pool Management</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Build and maintain a database of quality candidates. Access pre-screened talent for future openings.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <TrendingUp className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Hiring Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get insights on time-to-hire, candidate quality, and recruitment ROI. Make data-driven hiring decisions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Trusted by Top Companies</h2>
              <p className="text-gray-600">Join thousands of professionals working at leading organizations</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
              {/* Google */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <svg viewBox="0 0 272 92" className="h-8 w-auto">
                  <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                  <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                  <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                  <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
                </svg>
              </div>

              {/* Microsoft */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <svg viewBox="0 0 609 130" className="h-8 w-auto">
                  <path fill="#737373" d="M213.3 98.4V31.2h11.5l27.4 43.1V31.2h10.8v67.2h-11.5l-27.4-43.1v43.1h-10.8zm75.6-56.5v13.9h15.8v8.6h-15.8v24.1c0 7.5 2.1 11.7 8.2 11.7 2.9 0 5-.4 6.4-.8l.5 8.5c-2.1.9-5.5 1.5-9.7 1.5-5.1 0-9.2-1.6-11.8-4.5-3.1-3.1-4.2-8.2-4.2-15V64.4h-9.4v-8.6h9.4V45.5l10.6-3.6z"/>
                  <rect fill="#F25022" x="0" y="0" width="58" height="58"/>
                  <rect fill="#7FBA00" x="64" y="0" width="58" height="58"/>
                  <rect fill="#00A4EF" x="0" y="64" width="58" height="58"/>
                  <rect fill="#FFB900" x="64" y="64" width="58" height="58"/>
                </svg>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <svg viewBox="0 0 512 512" className="h-8 w-auto">
                  <path fill="#0668E1" d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.5 189 221.5V322.3h-56.8v-65h56.8v-49.5c0-56.1 33.4-87.1 84.6-87.1 24.5 0 50.2 4.4 50.2 4.4v55.2h-28.3c-27.8 0-36.5 17.3-36.5 35v42h62.2l-9.9 65h-52.3v156.5c107.1-17 189-109.7 189-221.5z"/>
                </svg>
              </div>

              {/* Infosys */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <div className="text-2xl font-bold text-blue-600">INFOSYS</div>
              </div>

              {/* Accenture */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <div className="text-2xl font-bold text-purple-600">Accenture</div>
              </div>

              {/* Razorpay */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <svg viewBox="0 0 120 30" className="h-7 w-auto">
                  <path fill="#0C2233" d="M8.5 5h3l7 15L26 5h3l-9.5 20h-2zm21 0h2.5v20H29.5zm15 0h3l7 15L62 5h3l-9.5 20h-2zm21 0h2.5v20H65.5z"/>
                  <path fill="#3395FF" d="M85 5l5 11-5 9-5-9zm15 0l5 11-5 9-5-9z"/>
                </svg>
              </div>

              {/* Zomato */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <svg viewBox="0 0 120 30" className="h-7 w-auto">
                  <path fill="#E23744" d="M15 8v14H5V8h10zm5-3v20h10V5H20zm15 8v9h10v-9H35z"/>
                  <text x="55" y="20" fill="#E23744" fontSize="16" fontWeight="bold">Zomato</text>
                </svg>
              </div>

              {/* Swiggy */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <div className="text-2xl font-bold text-orange-500">Swiggy</div>
              </div>

              {/* Blinkit */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <div className="text-2xl font-bold text-yellow-500">Blinkit</div>
              </div>

              {/* Mahindra */}
              <div className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition">
                <div className="text-xl font-bold text-red-700">MAHINDRA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">5K+</div>
                <div className="text-gray-600 font-medium">Companies Hiring</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
                <div className="text-gray-600 font-medium">Jobs Posted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">92%</div>
                <div className="text-gray-600 font-medium">Match Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <CTASection/>

      <Footer/>
    </div>
  );
};

export default MainHome;