import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Featured = () => {
  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm matches your skills and preferences with the perfect job opportunities.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: "Instant Applications",
      description: "Apply to multiple jobs with one click. Your profile is always ready to impress recruiters.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 32 }} />,
      title: "Real-Time Alerts",
      description: "Get notified instantly when jobs matching your profile are posted. Never miss an opportunity.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      title: "Verified Companies",
      description: "All companies on our platform are verified. Apply with confidence knowing you're safe.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      title: "Career Insights",
      description: "Access salary trends, skill demands, and industry insights to make informed career decisions.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <SearchIcon sx={{ fontSize: 32 }} />,
      title: "Advanced Filters",
      description: "Find exactly what you're looking for with powerful search filters and customization options.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Why Choose PathFinder
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to make your job search effortless and successful
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Featured;