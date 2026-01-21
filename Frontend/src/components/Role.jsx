import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const Role = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=3b82f6&color=fff&size=200",
      text: "PathFinder made my job search incredibly easy. I found my dream role at Google within 2 weeks! The AI matching is spot on.",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Marketing Manager at Amazon",
      image: "https://ui-avatars.com/api/?name=Rahul+Verma&background=8b5cf6&color=fff&size=200",
      text: "The platform is intuitive and the job recommendations are excellent. I received 3 interview calls in the first week itself!",
      rating: 5
    },
    {
      name: "Ananya Desai",
      role: "Product Designer at Microsoft",
      image: "https://ui-avatars.com/api/?name=Ananya+Desai&background=ec4899&color=fff&size=200",
      text: "Best job portal I've used. The instant application feature saved me so much time. Highly recommend to all job seekers!",
      rating: 5
    },
    {
      name: "Arjun Patel",
      role: "Data Analyst at Flipkart",
      image: "https://ui-avatars.com/api/?name=Arjun+Patel&background=10b981&color=fff&size=200",
      text: "Real-time alerts kept me ahead of the competition. I was one of the first applicants for my current job. Thank you PathFinder!",
      rating: 5
    }
  ];

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Success Stories
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Thousands of Job Seekers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our users have to say about their experience with PathFinder
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg">
                  <FormatQuoteIcon sx={{ fontSize: 24 }} />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} sx={{ color: '#f59e0b', fontSize: 20 }} />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full ring-2 ring-blue-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Join thousands of successful job seekers</p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Start Your Success Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default Role;