import React, { useState, useEffect } from 'react';
import { getJobs, submitApplication } from '../../services/api';
import MetaTags from '../common/MetaTags';
import MinimalJobCard from './MinimalJobCard';
import './Careers.css';

const OpenRoles = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [currentJob, setCurrentJob] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Form states for apply modal
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    linkedin: '',
    portfolio: '',
    cv: null,
    coverNote: '',
    noticePeriod: '',
    source: '',
    consent: false
  });

  // Fetch career page data and jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsRes = await getJobs();
      setJobs(jobsRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const openApplyModal = (job) => {
    setCurrentJob(job);
    setApplyStep(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitError('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      experience: '',
      linkedin: '',
      portfolio: '',
      cv: null,
      coverNote: '',
      noticePeriod: '',
      source: '',
      consent: false
    });
    setApplyStep(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const nextStep = () => setApplyStep(2);
  const prevStep = () => setApplyStep(1);

  const submitApply = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const applicationData = new FormData();
      applicationData.append('jobId', currentJob._id);
      applicationData.append('firstName', formData.firstName);
      applicationData.append('lastName', formData.lastName);
      applicationData.append('email', formData.email);
      applicationData.append('phone', formData.phone);
      applicationData.append('currentLocation', formData.location);
      applicationData.append('yearsExperience', formData.experience);
      applicationData.append('coverNote', formData.coverNote);
      if (formData.cv) {
        applicationData.append('cv', formData.cv);
      }
      
      const response = await submitApplication(applicationData);
      if (response.data.success) {
        setApplyStep(3);
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const jobsByDepartment = jobs.reduce((acc, job) => {
    const dept = job.dept || 'Open roles';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(job);
    return acc;
  }, {});

  return (
    <>
    <MetaTags
      title="Open Roles at Lexodd"
      description="Explore current openings at Lexodd and apply directly."
    />
    <div className='container'>
      <div className="page">
        {/* Loading State */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading career opportunities...</p>
          </div>
        )}

        {!loading && (
          <>
            <div className="view-content">
              <section className="open-positions">
                <div className="open-positions-head">
                  <h1>Open Positions</h1>
                  <p className="section-subtitle">
                    We're hiring for specific roles. No spam, no endless applications.
                  </p>
                </div>

                {Object.entries(jobsByDepartment).map(([dept, deptJobs]) => (
                  <div key={dept} className="job-group">
                    <h3>{dept} ({deptJobs.length})</h3>
                    <div className="jobs-list-minimal">
                      {deptJobs.map((job) => (
                        <MinimalJobCard
                          key={job._id || job.id}
                          job={job}
                          onApply={openApplyModal}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="no-jobs">
                    <p>No open positions at the moment.</p>
                    <p>Check back later or send us your resume.</p>
                  </div>
                )}
              </section>
            </div>

            {/* Apply Modal */}
            {showModal && (
              <div className="modal-bg open" onClick={closeModal}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-head">
                    <div>
                      <div className="modal-title">Apply for role</div>
                      <div className="modal-sub">Lexodd · {currentJob?.loc} · {currentJob?.type}</div>
                    </div>
                    <button className="modal-close" onClick={closeModal}>×</button>
                  </div>
                  <div className="modal-body">
                    {applyStep === 1 && (
                      <>
                        <div className="step-indicator">
                          <div className="step-info">Step 1 of 2 — Your details</div>
                          <div className="step-desc">Basic information so we know who you are before reading your work.</div>
                        </div>
                        <div className="form-row-2">
                          <div>
                            <label className="form-label">First name <span className="req">*</span></label>
                            <input
                              className="form-input"
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Arjun"
                            />
                          </div>
                          <div>
                            <label className="form-label">Last name <span className="req">*</span></label>
                            <input
                              className="form-input"
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Reddy"
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <label className="form-label">Email address <span className="req">*</span></label>
                          <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="arjun@example.com"
                          />
                        </div>
                        <div className="form-row">
                          <label className="form-label">Phone (with country code)</label>
                          <input
                            className="form-input"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div className="form-row-2">
                          <div>
                            <label className="form-label">Current location <span className="req">*</span></label>
                            <select
                              className="form-select"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                            >
                              <option value="">Select city</option>
                              <option>Hyderabad</option>
                              <option>Bangalore</option>
                              <option>Mumbai</option>
                              <option>Delhi</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Years of experience <span className="req">*</span></label>
                            <select
                              className="form-select"
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                            >
                              <option value="">Select</option>
                              <option>1–2 years</option>
                              <option>3–4 years</option>
                              <option>5–7 years</option>
                              <option>8–10 years</option>
                              <option>10+ years</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-row">
                          <label className="form-label">LinkedIn profile</label>
                          <input
                            className="form-input"
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/your-profile"
                          />
                        </div>
                        <div className="form-row">
                          <label className="form-label">Portfolio or GitHub</label>
                          <input
                            className="form-input"
                            type="url"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            placeholder="https://github.com/yourhandle"
                          />
                        </div>
                      </>
                    )}

                    {applyStep === 2 && (
                      <>
                        <div className="step-indicator">
                          <div className="step-info">Step 2 of 2 — Your work</div>
                          <div className="step-desc">Show us what you've built and how you think. Be direct — we read everything.</div>
                        </div>
                        <div className="form-row">
                          <label className="form-label">Upload CV / Resume <span className="req">*</span></label>
                          <div className="upload-zone">
                            <input
                              type="file"
                              name="cv"
                              accept=".pdf,.doc,.docx"
                              onChange={handleInputChange}
                              style={{ display: 'none' }}
                              id="cv-upload"
                            />
                            <label htmlFor="cv-upload" style={{ cursor: 'pointer', display: 'block' }}>
                              <div className="uz-icon">📎</div>
                              <div className="uz-main">Click to upload your CV</div>
                              <p>PDF, DOC, DOCX · Max 5MB</p>
                            </label>
                          </div>
                        </div>
                        <div className="form-row">
                          <label className="form-label">Cover note <span className="req">*</span></label>
                          <textarea
                            className="form-textarea"
                            name="coverNote"
                            value={formData.coverNote}
                            onChange={handleInputChange}
                            placeholder="Tell us what you've done that's relevant to this role — not what you're looking for. Specific projects, real outcomes, honest assessments of your strengths and gaps."
                          ></textarea>
                          <div className="form-hint">200–500 words is ideal. Don't use a template — we'll notice.</div>
                        </div>
                        <div className="form-row">
                          <label className="form-label">Notice period</label>
                          <select
                            className="form-select"
                            name="noticePeriod"
                            value={formData.noticePeriod}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            <option>Immediately available</option>
                            <option>2 weeks</option>
                            <option>1 month</option>
                            <option>2 months</option>
                            <option>3 months</option>
                            <option>Negotiable</option>
                          </select>
                        </div>
                        <div className="form-row">
                          <label className="form-label">How did you hear about this role?</label>
                          <select
                            className="form-select"
                            name="source"
                            value={formData.source}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            <option>LinkedIn</option>
                            <option>Referral</option>
                            <option>Our website</option>
                            <option>Job board</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="form-check-row">
                          <input
                            type="checkbox"
                            id="consent-check"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="consent-check">
                            I agree that Lexodd may store and process my application data for up to 12 months for the purposes of this and future relevant roles.
                          </label>
                        </div>
                      </>
                    )}

                    {applyStep === 3 && (
                      <div className="success-state">
                        <div className="success-icon">✓</div>
                        <div className="success-title">Application received.</div>
                        <p className="success-body">
                          We read every application. If your background matches what we're looking for, someone from the team will reach out directly — usually within 5–7 working days. No automated screening, no recruiter calls.
                        </p>
                        <div className="next-steps">
                          <div className="next-steps-title">What happens next</div>
                          <div className="step-list">
                            <div className="step-item">
                              <span className="step-num">01</span>
                              <span>A team member reviews your application and cover note personally</span>
                            </div>
                            <div className="step-item">
                              <span className="step-num">02</span>
                              <span>If it's a good match, we'll send a short technical prompt — not a test, a conversation starter</span>
                            </div>
                            <div className="step-item">
                              <span className="step-num">03</span>
                              <span>A direct call with someone doing the work — no HR intermediaries</span>
                            </div>
                          </div>
                        </div>
                        <button className="btn-o" onClick={closeModal}>Close</button>
                      </div>
                    )}
                    {submitError && applyStep !== 3 && (
                      <div className="form-error">{submitError}</div>
                    )}
                  </div>
                  {applyStep !== 3 && (
                    <div className="modal-footer">
                      <div className="step-dots">
                        <div className={`dot ${applyStep === 1 ? 'cur' : 'done'}`}></div>
                        <div className={`dot ${applyStep === 2 ? 'cur' : ''}`}></div>
                      </div>
                      <button className="btn-o" onClick={closeModal}>Cancel</button>
                      {applyStep === 1 && (
                        <button className="btn-p" onClick={nextStep}>Continue →</button>
                      )}
                      {applyStep === 2 && (
                        <>
                          <button className="btn-o" onClick={prevStep}>← Back</button>
                          <button className="btn-p" onClick={submitApply} disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit application'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default OpenRoles;
