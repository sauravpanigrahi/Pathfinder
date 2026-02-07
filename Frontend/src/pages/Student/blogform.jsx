import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Form = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    author_name: "",
  });
  // const userID = localStorage.getItem('userUID') || null;
  const [showSuccess, setShowSuccess] = useState(false);
  // console.log("userid:",userID)
  const back = () => navigate("/blog");

  const onchange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://pathfinder-maob.onrender.com/student/blog/form/${userID}`,
        form,
        { withCredentials: true },
      );

      setForm({
        title: "",
        description: "",
        author_name: "",
      });

      setShowSuccess(true);
      toast.success("Blog Posted");
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      toast.error("Blog Not Posted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Blog Form */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add a Blog Post
        </h2>
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a descriptive title"
              value={form.title}
              onChange={onchange}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blog Content
            </label>
            <textarea
              id="description"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your post..."
              value={form.description}
              onChange={onchange}
            />
          </div>
          <div>
            <label
              htmlFor="author_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Author Name
            </label>
            <input
              id="author_name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
              value={form.author_name}
              onChange={onchange}
            />
          </div>
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Post
            </button>
            {showSuccess && (
              <span className="ml-4 text-green-600 font-semibold flex items-center">
                ✅ Posted!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
