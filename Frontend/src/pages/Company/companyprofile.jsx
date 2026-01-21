import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaGlobe, FaIndustry, FaUsers, FaLinkedin, FaTwitter, FaFacebook, FaBuilding, FaCalendarAlt, FaSave, FaTimes } from 'react-icons/fa';
import { MdEmail, MdWork, MdLocationCity, MdEdit } from 'react-icons/md';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Loader} from "../../components/loader"
import Back from "../../components/backbutton"
const CompanyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);
    const [saving, setSaving] = useState(false);
    
    const uid = localStorage.getItem('company UID');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!uid) {
                toast.error("Please login first");
                navigate('/login/company');
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const profileRes = await axios.get(`https://pathfinder-qkw1.onrender.com/company/${uid}`);
                console.log('Profile response:', profileRes.data);
                const jobsRes = await axios.get(`https://pathfinder-qkw1.onrender.com/company/${uid}/jobs`);
                console.log('Jobs response:', jobsRes.data);
                if (profileRes.data && Object.keys(profileRes.data).length > 0) {
                    setProfile(profileRes.data);
                    setEditedProfile(profileRes.data);
                } else {
                    throw new Error('No profile data received');
                }
                setCompanyJobs(jobsRes.data || []);
            } catch (error) {
                console.error('Error:', error);
                const errorMessage = error.response?.data?.detail || error.message || 'Failed to load profile';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData()
    }, [uid, navigate]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel edit - reset to original profile
            setEditedProfile(profile);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field, value) => {
        setEditedProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

   const handleSocialMediaChange = (field, value) => {
    setEditedProfile(prev => ({
        ...prev,
        [field]: value
    }));
};
   const handleSaveProfile = async () => {
    try {
        setSaving(true);

        const payload = {
            companyName: editedProfile.companyName,
            industry: editedProfile.industry,
            companySize: editedProfile.companySize,
            locations: editedProfile.locations,
            address: editedProfile.address,
            contactNumber: editedProfile.contactNumber,
            workEmail: editedProfile.workEmail,
            website: editedProfile.website,
            foundedYear: editedProfile.foundedYear? Number(editedProfile.foundedYear):null,
            description: editedProfile.description,
            logoURL: editedProfile.logoURL,
            coverImageURL: editedProfile.coverImageURL,
            linkedinURL: editedProfile.linkedinURL,
            // twitter: editedProfile.twitter,
            // facebook:editedProfile.facebook,
        };
        console.log("edit",payload)
        const response = await axios.put(
            `https://pathfinder-qkw1.onrender.com/company/${uid}/edit`,
            payload
        );
        console.log(response.data)
        setProfile(response.data);
        setEditedProfile(response.data);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
        setSaving(false);
    }
};

    const handleCoverImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
                if (isEditing) {
                    setEditedProfile(prev => ({
                        ...prev,
                        coverImageURL: reader.result
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedProfile(prev => ({
                    ...prev,
                    logoURL: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if(loading){
        return <Loader/>
    }

    if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;

    const displayProfile = isEditing ? editedProfile : profile;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover Image Section */}
            <Back/>
           <div className="relative h-55 border-b border-gray-300 ">
    {/* Cover Image */}
    {displayProfile?.coverImageURL ? (
        <img
            src={displayProfile.coverImageURL}
            alt="Cover"
            className="w-full h-full object-cover"
            loading="lazy"
        />
    ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
    )}

    {/* Change Cover Button (CENTER) */}
    {isEditing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
            <label className="cursor-pointer border border-gray-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-all duration-300 hover:scale-105">
                <span className="flex items-center gap-2">
                    <MdEdit className="text-blue-600" />
                    Change Cover
                </span>

                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                />
            </label>
        </div>
    )}

    {/* Company Logo Overlay */}
    <div className="absolute -bottom-15 left-8 sm:left-12 z-20">
        <div className="bg-white p-1 rounded-xl shadow-xl relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                {displayProfile?.logoURL ? (
                    <img
                        src={displayProfile.logoURL}
                        alt={displayProfile.companyName}
                        className="w-full h-full object-contain rounded-lg"
                        loading="lazy"
                    />
                ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-gray-500">
                        {displayProfile?.companyName
                            ? displayProfile.companyName[0]
                            : <FaBuilding className="text-gray-400 text-4xl" />}
                    </span>
                )}
            </div>

            {/* Edit Logo Button */}
            {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 z-30">
                    <MdEdit />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                    />
                </label>
            )}
        </div>
    </div>
</div>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-20 pb-8">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Company Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Company Header */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedProfile?.companyName || ''}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full"
                                        />
                                    ) : (
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{displayProfile?.companyName}</h1>
                                    )}
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedProfile?.industry || ''}
                                            onChange={(e) => handleInputChange('industry', e.target.value)}
                                            className="text-gray-600 mt-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                            placeholder="Industry"
                                        />
                                    ) : (
                                        <p className="text-gray-600 mt-2 flex items-center gap-2">
                                            <FaIndustry /> {displayProfile?.industry}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button 
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                            >
                                                <FaSave className="mr-2" />
                                                {saving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button 
                                                onClick={handleEditToggle}
                                                disabled={saving}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                <FaTimes className="mr-2" />
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={handleEditToggle}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <MdEdit className="mr-2" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <EditableInfoItem 
                                    icon={<FaMapMarkerAlt />} 
                                    label="Location" 
                                    value={displayProfile?.locations}
                                    isEditing={isEditing}
                                    onChange={(value) => handleInputChange('locations', value)}
                                />
                                <EditableInfoItem 
                                    icon={<FaUsers />} 
                                    label="Company Size" 
                                    value={displayProfile?.companySize}
                                    isEditing={isEditing}
                                    onChange={(value) => handleInputChange('companySize', value)}
                                />
                                <EditableInfoItem 
                                    icon={<MdEmail />} 
                                    label="Work Email" 
                                    value={displayProfile?.workEmail}
                                    
                                    onChange={(value) => handleInputChange('workEmail', value)}
                                />
                                <EditableInfoItem 
                                    icon={<FaGlobe />} 
                                    label="Website" 
                                    value={displayProfile?.website}
                                    isEditing={isEditing}
                                    isLink={!isEditing}
                                    onChange={(value) => handleInputChange('website', value)}
                                />
                                <EditableInfoItem 
                                    icon={<FaCalendarAlt />} 
                                    label="FoundedYear" 
                                    value={displayProfile?.foundedYear ||""}
                                    isEditing={isEditing}
                                    onChange={(value) => handleInputChange('foundedYear', value)}
                                />
                                <EditableInfoItem 
                                    icon={<MdLocationCity />} 
                                    label="ContactNumber" 
                                    value={displayProfile?.contactNumber || ''}
                                    isEditing={isEditing}
                                    onChange={(value) => handleInputChange('contactNumber', value)}
                                />
                                <EditableInfoItem 
                                    icon={<MdLocationCity />} 
                                    label="Address" 
                                    value={displayProfile?.address || ''}
                                    isEditing={isEditing}
                                    onChange={(value) => handleInputChange('address', value)}
                                />
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">About Us</h2>
                            {isEditing ? (
                                <textarea
                                    value={editedProfile?.description || ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    placeholder="Company description..."
                                />
                            ) : (
                                <p className="text-gray-600 whitespace-pre-line">{displayProfile?.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Jobs & Social */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                            <div className="grid grid-cols-3 gap-2">
                                <StatCard number={companyJobs.jobs.length} label="Active Jobs" />
                                <StatCard number={companyJobs.scheduled} label="Interviews Scheduled" />
                                <StatCard number="0" label="Hired" />
                                <StatCard number="0" label="Interview Rejected" />
                            </div>

                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Social Media</h2>
                            <div className="space-y-3">
                                <EditableSocialLink 
                                    icon={<FaLinkedin />} 
                                    platform="LinkedIn" 
                                    url={displayProfile?.linkedinURL || ''}
                                    isEditing={isEditing}
                                    onChange={(value) => handleSocialMediaChange('linkedinURL', value)}
                                />
                                {/* <EditableSocialLink 
                                    icon={<FaTwitter />} 
                                    platform="Twitter" 
                                    url={displayProfile?.socialMedia?.twitter || ''}
                                    isEditing={isEditing}
                                    onChange={(value) => handleSocialMediaChange('twitter', value)}
                                />
                                <EditableSocialLink 
                                    icon={<FaFacebook />} 
                                    platform="Facebook" 
                                    url={displayProfile?.socialMedia?.facebook || ''}
                                    isEditing={isEditing}
                                    onChange={(value) => handleSocialMediaChange('facebook', value)}
                                /> */}
                            </div>
                        </div>

                        {/* Latest Jobs */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Latest Jobs</h2>
                                <button className="text-blue-600 text-sm hover:text-blue-800">View All</button>
                            </div>
                            <div className="space-y-4">
                                {companyJobs.jobs.slice(0, 3).map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const EditableInfoItem = ({ icon, label, value, isLink, isEditing, onChange }) => (
    <div className="flex items-center gap-3">
        <div className="text-gray-400">{icon}</div>
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            {isEditing ? (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900"
                />
            ) : isLink && value ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a>
            ) : (
                <p className="text-gray-900">{value || 'Not specified'}</p>
            )}
        </div>
    </div>
);

const StatCard = ({ number, label }) => (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xl font-bold text-blue-600">{number}</div>
        <div className="text-sm text-gray-600">{label}</div>
    </div>
);

const EditableSocialLink = ({ icon, platform, url, isEditing, onChange }) => {
    if (isEditing) {
        return (
            <div className="flex items-center gap-3 p-2">
                <span className="text-xl text-gray-600">{icon}</span>
                <div className="flex-1">
                    <p className="text-sm text-gray-500">{platform}</p>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`${platform} URL`}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        );
    }

    if (!url) return null;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
            <span className="text-xl text-gray-600">{icon}</span>
            <span className="text-gray-700">{platform}</span>
        </a>
    );
};

const JobCard = ({ job }) => (
    <div className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
        <h3 className="font-medium text-gray-900">{job.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <MdWork />
            <span>{job.type}</span>
            <span className="text-gray-300">•</span>
            <span>{job.location}</span>
            <div className="ml-auto">
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography>Off</Typography>
                    <Switch/>
                    <Typography>On</Typography>
                </Stack>
            </div>
        </div>
    </div>
);

export default CompanyProfile;