import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showMyBlogs, setShowMyBlogs] = useState(false);
  const userUID = localStorage.getItem('userUID') || null;

  const form = () => navigate(`/blogs/form/${userUID}`);
  
  useEffect(() => {
    document.body.className = 'bg-gray-50 text-gray-900';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/student/blog");
        console.log(response.data);
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      // UI-only delete: remove from local state
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
    }
  };

  const formattedDate = (iso) => {
    try {
      return new Date(iso).toLocaleString([], {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  // Filter posts based on toggle state
  const displayedPosts = showMyBlogs 
    ? posts.filter(post => post.stud_uid === userUID)
    : posts.filter(post => post.stud_uid !== userUID);

  const myPostsCount = posts.filter(post => post.stud_uid === userUID).length;
  const otherPostsCount = posts.filter(post => post.stud_uid !== userUID).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
      <main className="max-w-8xl mx-auto py-8 px-4">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Engineering <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-gray-600 mb-4">
            Discover the latest in circuit simulation, tutorials, and engineering excellence
          </p>
        </section>

        {/* Add Post Card */}
        <div className="mb-8 flex justify-center">
          <div
            className="w-full max-w-xl cursor-pointer rounded-xl border border-gray-200 bg-white hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            onClick={form}
          >
            <div className="flex items-center gap-4 p-6">
              <div className="bg-indigo-600 text-white rounded-full p-3 flex items-center justify-center">
                <span className="text-2xl font-bold">+</span>
              </div>
              <div>
                <h5 className="font-semibold text-lg mb-1 text-gray-800">Add your content</h5>
                <p className="text-sm text-gray-600">
                  Create a new post and contribute to the engineering community
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setShowMyBlogs(false)}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                !showMyBlogs
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Blogs
              <span className="ml-2 text-xs opacity-75">({otherPostsCount})</span>
            </button>
            <button
              onClick={() => setShowMyBlogs(true)}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                showMyBlogs
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Blogs
              <span className="ml-2 text-xs opacity-75">({myPostsCount})</span>
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {showMyBlogs ? 'My Blogs' : 'All Blogs'}
            </h3>
            <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              {displayedPosts.length} {displayedPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {displayedPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="mb-4 text-6xl">📄</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {showMyBlogs ? 'You haven\'t created any posts yet' : 'No posts from others yet'}
              </h4>
              <p className="text-gray-600 mb-4">
                {showMyBlogs 
                  ? 'Start sharing your engineering insights with the community!' 
                  : 'Check back later for posts from other community members!'}
              </p>
              {showMyBlogs && (
                <button
                  onClick={form}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            // Grid layout for All Blogs, space-y for My Blogs
            <div className={showMyBlogs ? "space-y-5" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6"}>
              {displayedPosts.map((post, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h5 className="font-bold text-xl text-gray-800 flex-1 leading-tight">
                      {post.title}
                    </h5>
                    {/* Conditional Delete Button - only for user's own posts */}
                    {post.stud_uid === userUID && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                        className="flex-shrink-0 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
                        title="Delete post"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {post.author_name || 'Anonymous'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formattedDate(post.publish_date)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {post.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Blog;
