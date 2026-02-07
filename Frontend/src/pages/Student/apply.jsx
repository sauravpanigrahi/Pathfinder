import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "/src/css/Loader.css";
import Resume from "../../components/Resume";
import { useAppContext } from "../../AppContext";
import { Loader, DeleteLoader } from "../../components/loader";
import { Trash } from "lucide-react";

const JobApplicationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userUID = localStorage.getItem("userUID");
  const { companyuid } = useParams();
  const [profiledata, setProfileData] = useState({
    name: "",
    email: "",
    details: {},
  });
  const [deleting, setDeleting] = useState(false);
  const [project, setProject] = useState([]);
  const [experience, setExperiences] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const { resume } = useAppContext();
  const { jobTitle, companyName, jobLocation } = location.state || {};

  useEffect(() => {
    if (!userUID) return;
    const fetchDetails = async () => {
      try {
        const [profileRes, projectRes, experienceRes] = await Promise.all([
          axios.get(`https://pathfinder-maob.onrender.com/profile/${userUID}`, {
            withCredentials: true,
          }),
          axios.get(`https://pathfinder-maob.onrender.com/project/${userUID}`, {
            withCredentials: true,
          }),
          axios.get(
            `https://pathfinder-maob.onrender.com/experience/${userUID}`,
            {
              withCredentials: true,
            },
          ),
        ]);
        const { details, ...userInfo } = profileRes.data;
        setProfileData({ ...userInfo, details });
        setProject(projectRes.data);
        setExperiences(experienceRes.data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    fetchDetails();
  }, [userUID]);

  const [formData, setFormData] = useState({
    stud_uid: userUID,
    comp_uid: companyuid,
    Job_role: jobTitle,
    Job_company: companyName,
    Job_location: jobLocation,
    Fullname: "",
    Email: "",
    phonenumber: "",
    Dob: "",
    high_qualification: "",
    college: "",
    graduation_year: "",
    linkedin_url: "",
    github_url: "",
    why_join: "",
  });

  useEffect(() => {
    if (!profiledata?.name) return;
    setFormData((prev) => ({
      ...prev,
      Fullname: profiledata.name,
      Email: profiledata.email,
      phonenumber: profiledata.details?.phone_number || "",
      Dob: profiledata.details?.date_of_birth || "",
      high_qualification: profiledata.details?.qualification || "",
      college: profiledata.details?.college_university || "",
      graduation_year: profiledata.details?.graduation_year || "",
      linkedin_url: profiledata.details?.linkedin_url || "",
      github_url: profiledata.details?.github_url || "",
    }));
  }, [profiledata]);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (!userUID) {
      toast.error("Please login first");
      navigate("/login/student");
    }
  }, [userUID, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting:", formData);
      await axios.post(
        "https://pathfinder-maob.onrender.com/student/apply",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      toast.success("Application Submitted Successfully");
      navigate("/listedjobs");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.detail || "Failed to submit application");
    }
  };

  const nextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (step) => setCurrentStep(step);

  const steps = [
    { id: 1, name: "Profile Review" },
    { id: 2, name: "Cover Letter" },
  ];

  const handleDeleteResume = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );
    if (!confirmed || deleting) return;
    try {
      setDeleting(true);
      await axios.delete(
        `https://pathfinder-maob.onrender.com/student/resume/delete/${userUID}`,
        { withCredentials: true },
      );
      toast.success("Resume deleted successfully");
      setResumeFile(null);
      setIsDeleted(true);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting resume. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // ─── small helper ───────────────────────────────────
  const InfoRow = ({ label, value }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#8a8fa8",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 13.5, color: "#1e2030", fontWeight: 500 }}>
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        padding: "32px 16px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        * { box-sizing: border-box; }

        .jaf-page { max-width: 780px; margin: 0 auto; }

        /* ── Header ── */
        .jaf-header {
          background: #1e2030;
          border-radius: 18px;
          padding: 28px 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .jaf-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(99,102,241,0.12);
          pointer-events: none;
        }
        .jaf-header::after {
          content: '';
          position: absolute;
          bottom: -30px; left: 60px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(99,102,241,0.07);
          pointer-events: none;
        }
        .jaf-header-inner { position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 20px; }
        .jaf-icon-wrap {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
        .jaf-icon-wrap svg { width: 22px; height: 22px; }
        .jaf-header-text .jaf-role {
          font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.3px; margin-bottom: 6px;
        }
        .jaf-header-text .jaf-meta { display: flex; flex-wrap: wrap; gap: 6px 18px; }
        .jaf-meta-item { font-size: 12.5px; color: #7e8299; display: flex; align-items: center; gap: 5px; }
        .jaf-meta-item svg { width: 13px; height: 13px; opacity: 0.7; }

        /* ── Stepper ── */
        .jaf-stepper {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-bottom: 28px; padding: 0 8px;
        }
        .jaf-step {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          cursor: pointer; background: none; border: none; padding: 0;
          transition: opacity 0.2s;
        }
        .jaf-step:hover { opacity: 0.85; }
        .jaf-step-indicator {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
          transition: all 0.25s ease;
          border: 2px solid #d1d5db;
          background: #fff; color: #9ca3af;
        }
        .jaf-step--active .jaf-step-indicator {
          border-color: #6366f1; background: #6366f1; color: #fff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.18);
        }
        .jaf-step--done .jaf-step-indicator {
          border-color: #22c55e; background: #22c55e; color: #fff;
        }
        .jaf-step-label { font-size: 11.5px; font-weight: 600; color: #8a8fa8; text-transform: uppercase; letter-spacing: 0.06em; }
        .jaf-step--active .jaf-step-label { color: #6366f1; }
        .jaf-step--done .jaf-step-label { color: #22c55e; }

        .jaf-step-line {
          flex: 1; height: 2px; max-width: 120px;
          background: #e5e7eb; border-radius: 2px;
          transition: background 0.3s;
        }
        .jaf-step-line--done { background: #22c55e; }

        /* ── Card ── */
        .jaf-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8eaef;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        /* section title */
        .jaf-section-title {
          font-size: 13px; font-weight: 700; color: #6366f1;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 16px; padding-bottom: 8px;
          border-bottom: 1.5px solid #eef0f5;
        }

        /* info grid */
        .jaf-info-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px 24px;
          margin-bottom: 28px;
        }
        @media (max-width:520px) { .jaf-info-grid { grid-template-columns: 1fr; } }

        /* single row full width */
        .jaf-info-full { margin-bottom: 28px; }

        /* project / experience cards */
        .jaf-item-card {
          background: #f7f8fa; border: 1px solid #eef0f5; border-radius: 12px;
          padding: 18px 20px; margin-bottom: 12px; transition: border-color 0.2s;
        }
        .jaf-item-card:hover { border-color: #d1d5db; }
        .jaf-item-card:last-child { margin-bottom: 0; }
        .jaf-item-card--title { font-size: 14px; font-weight: 600; color: #1e2030; margin-bottom: 4px; }
        .jaf-item-card--sub { font-size: 12.5px; color: #6b7085; margin-bottom: 2px; }
        .jaf-item-card--desc { font-size: 12.5px; color: #6b7085; line-height: 1.5; margin-top: 6px; }
        .jaf-item-card--link {
          font-size: 12px; color: #6366f1; font-weight: 600;
          text-decoration: none; display: inline-flex; align-items: center; gap: 3px; margin-top: 8px;
          transition: color 0.2s;
        }
        .jaf-item-card--link:hover { color: #4f46e5; }
        .jaf-item-card--tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .jaf-tag {
          font-size: 11px; font-weight: 600; color: #6366f1;
          background: #eef0ff; border-radius: 20px; padding: 2px 9px; letter-spacing: 0.02em;
        }

        .jaf-empty { font-size: 13px; color: #9ca3af; font-style: italic; padding: 12px 0; }

        /* Step 2 – textarea */
        .jaf-textarea-wrap label {
          display: block; font-size: 13px; font-weight: 600; color: #1e2030; margin-bottom: 8px;
        }
        .jaf-textarea-wrap label .req { color: #ef4444; }
        .jaf-textarea {
          width: 100%; min-height: 150px; resize: vertical;
          border: 1.5px solid #dfe1e8; border-radius: 12px;
          padding: 14px 16px; font-size: 13.5px; color: #1e2030;
          font-family: inherit; line-height: 1.6;
          background: #fafbfc; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .jaf-textarea:focus {
          border-color: #6366f1; background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .jaf-textarea::placeholder { color: #a0a4b8; }
        .jaf-char-count { font-size: 11.5px; color: #9ca3af; margin-top: 6px; text-align: right; }

        /* resume row */
        .jaf-resume-row {
          display: flex; align-items: center; gap: 12px;
          margin-top: 24px; padding: 14px 16px;
          background: #f7f8fa; border: 1px solid #eef0f5;
          border-radius: 12px;
        }
        .jaf-resume-row .jaf-resume-label { font-size: 13px; font-weight: 600; color: #1e2030; }
        .jaf-del-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          border: 1.5px solid #fca5a5; background: #fef2f2;
          color: #dc2626; cursor: pointer; transition: all 0.2s;
        }
        .jaf-del-btn:hover { background: #fee2e2; border-color: #f87171; }
        .jaf-del-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* nav bar */
        .jaf-nav {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 32px; padding-top: 24px; border-top: 1.5px solid #f0f1f4;
        }
        .jaf-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; border-radius: 10px; font-size: 13.5px; font-weight: 600;
          border: none; cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .jaf-btn--ghost {
          background: #f0f1f4; color: #4a4f6a;
        }
        .jaf-btn--ghost:hover { background: #e4e6ec; }
        .jaf-btn--ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .jaf-btn--primary {
          background: #6366f1; color: #fff;
          box-shadow: 0 3px 10px rgba(99,102,241,0.3);
        }
        .jaf-btn--primary:hover { background: #5254e0; box-shadow: 0 4px 14px rgba(99,102,241,0.38); }
        .jaf-btn--submit {
          background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
          box-shadow: 0 3px 10px rgba(34,197,94,0.3); padding: 11px 28px;
        }
        .jaf-btn--submit:hover { box-shadow: 0 4px 14px rgba(34,197,94,0.4); }

        .jaf-dots { display: flex; gap: 6px; align-items: center; }
        .jaf-dot { width: 7px; height: 7px; border-radius: 50%; background: #d1d5db; transition: all 0.25s; }
        .jaf-dot--active { width: 22px; border-radius: 4px; background: #6366f1; }

        /* footer */
        .jaf-footer {
          text-align: center; margin-top: 20px;
          font-size: 11.5px; color: #9ca3af; display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .jaf-footer svg { width: 13px; height: 13px; opacity: 0.6; }

        /* slide-in animation */
        @keyframes jaf-slide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .jaf-animate { animation: jaf-slide 0.3s ease-out; }
      `}</style>

      <div className="jaf-page">
        {/* ── Header ── */}
        <div className="jaf-header">
          <div className="jaf-header-inner">
            <div className="jaf-icon-wrap">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
            </div>
            <div className="jaf-header-text">
              <div className="jaf-role">{jobTitle || "Position"}</div>
              <div className="jaf-meta">
                <span className="jaf-meta-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  {companyName || "Company"}
                </span>
                <span className="jaf-meta-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {jobLocation || "Location"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="jaf-stepper">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isDone = completedSteps.includes(step.id);
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  className={`jaf-step ${isActive ? "jaf-step--active" : isDone ? "jaf-step--done" : ""}`}
                >
                  <div className="jaf-step-indicator">
                    {isDone ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="jaf-step-label">{step.name}</span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`jaf-step-line ${completedSteps.includes(step.id) ? "jaf-step-line--done" : ""}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Form Card ── */}
        <div className="jaf-card">
          <form onSubmit={handleSubmit}>
            {/* ─── STEP 1 ─── */}
            {currentStep === 1 && (
              <div className="jaf-animate">
                {/* Personal Info */}
                <div className="jaf-section-title">Personal Information</div>
                <div className="jaf-info-grid">
                  <InfoRow label="Full Name" value={profiledata.name} />
                  <InfoRow label="Email" value={profiledata.email} />
                  <InfoRow
                    label="Phone"
                    value={profiledata.details?.phone_number}
                  />
                  <InfoRow
                    label="Date of Birth"
                    value={profiledata.details?.date_of_birth}
                  />
                  <InfoRow
                    label="LinkedIn"
                    value={profiledata.details?.linkedin_url}
                  />
                  <InfoRow
                    label="GitHub"
                    value={profiledata.details?.github_url}
                  />
                </div>

                {/* Address */}
                <div className="jaf-section-title">Address</div>
                <div className="jaf-info-full">
                  <span
                    style={{
                      fontSize: 13.5,
                      color: "#1e2030",
                      fontWeight: 500,
                    }}
                  >
                    {profiledata.details?.address || "—"}
                  </span>
                </div>

                {/* Bio */}
                <div className="jaf-section-title">About You</div>
                <div className="jaf-info-full">
                  <span
                    style={{
                      fontSize: 13.5,
                      color: "#4a4f6a",
                      lineHeight: 1.65,
                    }}
                  >
                    {profiledata.details?.bio || "No bio provided"}
                  </span>
                </div>

                {/* Projects */}
                <div className="jaf-section-title">Projects</div>
                <div style={{ marginBottom: 28 }}>
                  {project?.length > 0 ? (
                    project.map((proj) => (
                      <div key={proj.id} className="jaf-item-card">
                        <div className="jaf-item-card--title">{proj.Title}</div>
                        {proj.description && (
                          <div className="jaf-item-card--desc">
                            {proj.description}
                          </div>
                        )}
                        {proj.tech_stack && (
                          <div className="jaf-item-card--tags">
                            {(typeof proj.tech_stack === "string"
                              ? proj.tech_stack.split(",")
                              : proj.tech_stack
                            ).map((t, i) => (
                              <span key={i} className="jaf-tag">
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="jaf-item-card--link"
                          >
                            View Project
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7,7 17,7 17,17" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="jaf-empty">No projects added.</p>
                  )}
                </div>

                {/* Experience */}
                <div className="jaf-section-title">Work Experience</div>
                <div>
                  {experience?.length > 0 ? (
                    experience.map((exp, index) => (
                      <div key={index} className="jaf-item-card">
                        <div className="jaf-item-card--title">
                          {exp.role} — {exp.company_name}
                        </div>
                        {exp.duration && (
                          <div className="jaf-item-card--sub">
                            {exp.duration}
                          </div>
                        )}
                        {exp.description && (
                          <div className="jaf-item-card--desc">
                            {exp.description}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="jaf-empty">No work experience added.</p>
                  )}
                </div>

                {/* Note */}
                <p
                  style={{
                    fontSize: 11.5,
                    color: "#9ca3af",
                    marginTop: 24,
                    fontStyle: "italic",
                  }}
                >
                  If any information is incorrect, please update your profile
                  before continuing.
                </p>
              </div>
            )}

            {/* ─── STEP 2 ─── */}
            {currentStep === 2 && (
              <div className="jaf-animate">
                <div className="jaf-section-title">Cover Letter</div>

                <div className="jaf-textarea-wrap">
                  <label>
                    Why do you want to join us? <span className="req">*</span>
                  </label>
                  <textarea
                    className="jaf-textarea"
                    name="why_join"
                    value={formData.why_join}
                    onChange={handleInputChange}
                    placeholder="Share your motivation and what excites you about this opportunity…"
                    rows="7"
                    required
                  />
                  <div className="jaf-char-count">
                    {formData.why_join.length} characters
                  </div>
                </div>

                {/* Resume */}
                <div className="jaf-section-title" style={{ marginTop: 28 }}>
                  Resume
                </div>
                <div className="jaf-resume-row">
                  <Resume />
                  {resume && !isDeleted && (
                    <button
                      type="button"
                      onClick={handleDeleteResume}
                      disabled={deleting}
                      className="jaf-del-btn"
                      title="Delete Resume"
                    >
                      {deleting ? (
                        <DeleteLoader />
                      ) : (
                        <Trash size={16} strokeWidth={2} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="jaf-nav">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="jaf-btn jaf-btn--ghost"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12,19 5,12 12,5" />
                </svg>
                Previous
              </button>

              <div className="jaf-dots">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`jaf-dot ${currentStep === step.id ? "jaf-dot--active" : ""}`}
                  />
                ))}
              </div>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="jaf-btn jaf-btn--primary"
                >
                  Next
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </button>
              ) : (
                <button type="submit" className="jaf-btn jaf-btn--submit">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <div className="jaf-footer">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Your information is secure and will only be used for recruitment
          purposes.
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
