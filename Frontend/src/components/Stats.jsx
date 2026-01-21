import React from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';

const Stats = () => {
  const stats = [
    { 
      icon: <BusinessCenterIcon sx={{ fontSize: 20 }} />, 
      value: "1000+", 
      label: "Active Jobs",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: <GroupsIcon sx={{ fontSize: 20 }} />, 
      value: "5,000+", 
      label: "Job Seekers",
      color: "from-purple-500 to-purple-600"
    },
    { 
      icon: <VerifiedIcon sx={{ fontSize: 20 }} />, 
      value: "500+", 
      label: "Companies",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, 
      value: "95%", 
      label: "Success Rate",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="py-16 px-4 bg-white border-y border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-2 rounded-full bg-gradient-to-br ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-small">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;