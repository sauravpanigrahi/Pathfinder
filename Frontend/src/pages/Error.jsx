import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw, AlertCircle, Server, FileQuestion, Shield } from 'lucide-react';

const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // useRouteError() returns undefined when used as catch-all route (not errorElement)
  // It only has a value when used as errorElement in React Router
  // Call hook unconditionally - it's safe, will return undefined if no error context
  const error = useRouteError();
  
  const [errorInfo, setErrorInfo] = useState({
    status: 404,
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    icon: FileQuestion,
    color: 'blue'
  });

  useEffect(() => {
    // Determine error type and set appropriate info
    if (error && isRouteErrorResponse(error)) {
      const status = error.status;
      let errorData = {
        status,
        title: '',
        message: '',
        icon: AlertCircle,
        color: 'red'
      };

      switch (status) {
        case 404:
          errorData = {
            status: 404,
            title: 'Page Not Found',
            message: 'The page you are looking for does not exist or has been moved.',
            icon: FileQuestion,
            color: 'blue'
          };
          break;
        case 403:
          errorData = {
            status: 403,
            title: 'Access Forbidden',
            message: 'You do not have permission to access this page.',
            icon: Shield,
            color: 'orange'
          };
          break;
        case 401:
          errorData = {
            status: 401,
            title: 'Unauthorized',
            message: 'Please log in to access this page.',
            icon: Shield,
            color: 'yellow'
          };
          break;
        case 500:
          errorData = {
            status: 500,
            title: 'Server Error',
            message: 'Something went wrong on our end. Please try again later.',
            icon: Server,
            color: 'red'
          };
          break;
        default:
          errorData = {
            status,
            title: 'An Error Occurred',
            message: error.statusText || 'Something went wrong. Please try again.',
            icon: AlertCircle,
            color: 'red'
          };
      }

      setErrorInfo(errorData);
    } else if (error instanceof Error) {
      setErrorInfo({
        status: 500,
        title: 'Application Error',
        message: error.message || 'An unexpected error occurred.',
        icon: AlertCircle,
        color: 'red'
      });
    }
  }, [error]);

  const IconComponent = errorInfo.icon;
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      gradient: 'from-blue-500 to-blue-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
      gradient: 'from-red-500 to-red-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
      gradient: 'from-orange-500 to-orange-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      gradient: 'from-yellow-500 to-yellow-600'
    }
  };

  const colors = colorClasses[errorInfo.color] || colorClasses.red;

  // Determine if user is student or company based on path
  const isStudent = location.pathname.includes('/home') || 
                    location.pathname.includes('/student') || 
                    location.pathname.includes('/listedjobs') ||
                    location.pathname.includes('/settings');
  const isCompany = location.pathname.includes('/company') || 
                    location.pathname.includes('/analytics') ||
                    location.pathname.includes('/companyhome');

  const handleGoHome = () => {
    if (isStudent) {
      navigate('/home');
    } else if (isCompany) {
      navigate('/companyhome');
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border-2 ${colors.border}`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${colors.gradient} p-8 text-white`}>
            <div className="flex items-center justify-center mb-4">
              <div className={`${colors.bg} p-4 rounded-full`}>
                <IconComponent className={`w-16 h-16 ${colors.icon}`} />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-center mb-2">{errorInfo.status}</h1>
            <h2 className="text-2xl font-semibold text-center">{errorInfo.title}</h2>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-gray-600 text-center text-lg mb-8">
              {errorInfo.message}
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className={`${colors.bg} rounded-xl p-4 mb-6 border ${colors.border}`}>
                <details className="cursor-pointer">
                  <summary className="font-semibold text-gray-700 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    Path: {location.pathname}
                  </p>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoBack}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
              
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Home className="w-5 h-5" />
                {isStudent ? 'Go to Student Home' : isCompany ? 'Go to Company Home' : 'Go to Home'}
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
