import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function StudDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const uid = location.state?.uid || JSON.parse(localStorage.getItem('uid')) || null

  const [formData, setFormData] = useState({
    phone_number: '',
    date_of_birth: '',
    address: '',
    bio: '',
    qualification: '',
    graduation_year: '',
    college_university: '',
    linkedin_url: '',
    github_url: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!uid) {
        toast.error('Missing user id. Please login again.')
        navigate('/login/student')
        return
      }
      const payload = {
        uid,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        bio: formData.bio || null,
        qualification: formData.qualification,
        graduation_year: Number(formData.graduation_year),
        college_university: formData.college_university,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null
      }
      await axios.post('https://pathfinder-maob.onrender.com/student/details', payload, {
        headers: { 'Content-Type': 'application/json' }
      })
      toast.success('Details saved')
      navigate('/home')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save details')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6 sm:px-10 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Complete your profile</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">This helps us personalize jobs for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number *"
            value={formData.phone_number}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
            required
          />
          <input
            type="date"
            name="date_of_birth"
            placeholder="Date of Birth *"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address *"
            value={formData.address}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base sm:col-span-2"
            required
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base sm:col-span-2"
          />
          <select
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
            required
          >
            <option value="">Select qualification</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
          <input
            type="number"
            name="graduation_year"
            placeholder="Graduation Year *"
            value={formData.graduation_year}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
            required
          />
          <input
            type="text"
            name="college_university"
            placeholder="College/University *"
            value={formData.college_university}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base sm:col-span-2"
            required
          />
          <input
            type="url"
            name="linkedin_url"
            placeholder="LinkedIn URL"
            value={formData.linkedin_url}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
          />
          <input
            type="url"
            name="github_url"
            placeholder="GitHub URL"
            value={formData.github_url}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
          />

          <button
            type="submit"
            className="sm:col-span-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm sm:text-base transition-all duration-200"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  )
}
