import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from "@mui/material/InputAdornment";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
const Welcome = () => {
  const navigate=useNavigate()
  return (
    <div className="welcome-section bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Content - Enhanced Typography & Spacing */}
          <div className="content w-full lg:w-[58%] flex flex-col justify-center text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-gray-900 leading-tight">
                Welcome to <span className="text-blue-700">PathFinder</span>
              </h1>
              <div className="w-20 h-1 bg-blue-600 mx-auto lg:mx-0 rounded-full"></div>
            </div>
            
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Discover your dream job with the power of intelligent job matching. 
              PathFinder connects talent with opportunity—<strong className="text-gray-800">fast, smart, and personalized.</strong>
            </p>
            
            <div className="space-y-3">
              <p className="text-base text-gray-700">
                Start your journey today and let the right job find you.
              </p>
              <p className="text-base text-gray-700">
                Say goodbye to endless scrolling and irrelevant listings.
              </p>
              <p className="text-base font-medium text-blue-700">
                With PathFinder, your career moves forward—confidently and effortlessly.
              </p>
            </div>

            {/* Enhanced Search Field */}
            {/* <div className="search-container pt-4">
              <div className="max-w-lg mx-auto lg:mx-0">
                <TextField
                  variant="outlined"
                  placeholder="Search your dream job, company, or role..."
                  fullWidth
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      height: '56px',
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: 'white',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 6px 24px rgba(59, 130, 246, 0.15)',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#3b82f6', fontSize: '24px' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
                  <span className="text-sm text-gray-500">Popular searches:</span>
                  {['Remote', 'Engineering', 'Marketing', 'Design'].map((tag) => (
                    <button 
                      key={tag}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div> */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
             {/* <button
                onClick={() => navigate("/login/student")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </button> */}

              <button
                onClick={() => navigate("/listedjobs")}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Explore Jobs
              </button>
</div>

          </div>

          {/* Right Image - Enhanced Design */}
          <div className="image-container w-full lg:w-[40%] flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-20 blur-lg animate-pulse"></div>
              <img
                src="src/assets/img.png"
                alt="Welcome to PathFinder"
                className="relative  rounded-full w-67 h-67 sm:w-80 sm:h-80 lg:w-96 lg:h-96 shadow-2xl ring-4 ring-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
