import React from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CelebrationIcon from '@mui/icons-material/Celebration';

const companies= () => {
  const steps = [
    {
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      step: "Step 1",
      title: "Create Your Profile",
      description: "Sign up in seconds and build your professional profile. Add your skills, experience, and preferences.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      step: "Step 2",
      title: "Discover Opportunities",
      description: "Browse through thousands of verified job listings or let our AI recommend the perfect matches for you.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <SendIcon sx={{ fontSize: 40 }} />,
      step: "Step 3",
      title: "Apply Instantly",
      description: "Apply to multiple jobs with one click. Track all your applications in one convenient dashboard.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <CelebrationIcon sx={{ fontSize: 40 }} />,
      step: "Step 4",
      title: "Get Hired",
      description: "Receive interview calls from top companies. Land your dream job and start your success journey!",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-50"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How PathFinder Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in 4 simple steps and land your dream job faster than ever
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className={`relative bg-gradient-to-br ${item.color} text-white w-24 h-24 rounded-full flex items-center justify-center shadow-xl mb-6 transform hover:scale-110 transition-all duration-300 ring-8 ring-white`}>
                  {item.icon}
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <span className={`inline-block px-3 py-1 bg-gradient-to-r ${item.color} text-white rounded-full text-xs font-semibold mb-3`}>
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default companies;