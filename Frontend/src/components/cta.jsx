import React from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CTASection = ({ onGetStarted }) => {
  const benefits = [
    "Free forever account",
    "AI-powered job matching",
    "Instant application process",
    "Real-time job alerts",
    "Career insights & analytics"
  ];

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <RocketLaunchIcon sx={{ fontSize: 20 }} />
              <span className="text-sm font-semibold">Start Your Journey Today</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Your Dream Job is Just One Click Away
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of successful job seekers who found their perfect career match with PathFinder. Start your journey today—it's completely free!
            </p>

            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircleIcon sx={{ fontSize: 24, color: '#10b981' }} />
                  <span className="text-lg text-white/90">{benefit}</span>
                </div>
              ))}
            </div>

           
          </div>

          {/* Right Visual Element */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -inset-8 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-xl">
                        <CheckCircleIcon sx={{ fontSize: 32 }} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">50,000+</h4>
                        <p className="text-gray-600">Success Stories</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-3 rounded-xl">
                        <RocketLaunchIcon sx={{ fontSize: 32 }} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">95%</h4>
                        <p className="text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-3 rounded-xl">
                        <CheckCircleIcon sx={{ fontSize: 32 }} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">5,000+</h4>
                        <p className="text-gray-600">Partner Companies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CTASection;