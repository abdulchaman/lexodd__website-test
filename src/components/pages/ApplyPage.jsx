import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getJobById, submitApplication } from '../../services/api';
import Button from '../common/Button';
import MetaTags from '../common/MetaTags';
import './ApplyPage.css';

const initialFormData = {
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
};

const FieldTag = ({ optional = false }) => (
  <span className={optional ? 'field-tag optional' : 'field-tag'}>
    {optional ? 'Optional' : 'Required'}
  </span>
);

const ApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(jobId);
        setJob(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleInputChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const submitData = new FormData();
      submitData.append('jobId', jobId);
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('currentLocation', formData.location);
      submitData.append('yearsExperience', formData.experience);
      submitData.append('linkedinUrl', formData.linkedin);
      submitData.append('portfolioUrl', formData.portfolio);
      submitData.append('coverNote', formData.coverNote);
      submitData.append('noticePeriod', formData.noticePeriod);
      submitData.append('source', formData.source);
      submitData.append('consentGiven', String(formData.consent));

      if (formData.cv instanceof File) {
        submitData.append('cv', formData.cv);
      }

      await submitApplication(submitData);
      setSubmitted(true);
    } catch (error) {
      console.error('Application submission failed:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToStepTwo = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'location', 'experience'];
    if (required.some((field) => !String(formData[field] || '').trim())) {
      setSubmitError('Please complete all required personal information fields.');
      return;
    }
    setSubmitError('');
    setStep(2);
  };

  const goToReview = () => {
    if (!(formData.cv instanceof File) || !formData.coverNote.trim() || !formData.consent) {
      setSubmitError('Please attach your CV, add a cover note, and confirm consent before reviewing.');
      return;
    }
    setSubmitError('');
    setStep(3);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading application...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container">
        <div className="page">
          <div className="empty-state">
            <h3>Job not found</h3>
            <p>This role may no longer be available.</p>
            <Button variant="secondary" onClick={() => navigate('/open-roles')}>Back to open roles</Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <MetaTags title={`Application submitted - ${job.title}`} />
        <div className="container">
          <div className="page">
            <div className="apply-success">
              <div className="success-icon">OK</div>
              <h1>Application received</h1>
              <p>We've received your application for {job.title}. Our team will review it and reach out within 5-7 working days.</p>
              <Button variant="primary" onClick={() => navigate('/open-roles')}>Back to open roles</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title={`Apply for ${job.title}`} description={`Apply for ${job.title} at Lexodd.`} />
      <div className="apply-page">
        <section className="apply-hero">
          <div className="apply-hero-content">
            <button className="apply-back" type="button" onClick={() => navigate('/open-roles')}>Back to roles</button>
            <h1>Apply for {job.title}</h1>
            <div className="job-details-summary">
              <div className="apply-job-meta">
                <span className="badge">{job.dept || 'Team'}</span>
                <span className="badge">{job.loc || 'Location flexible'}</span>
                <span className="badge">{job.type || 'Role type open'}</span>
                {job.exp && <span className="badge">{job.exp}</span>}
              </div>
              {job.desc && <p className="job-description">{job.desc}</p>}
            </div>
          </div>
        </section>

        <div className="apply-form-container">
          <div className="form-progress">
            {['Personal', 'Work', 'Review'].map((label, index) => {
              const number = index + 1;
              return (
                <React.Fragment key={label}>
                  {index > 0 && <div className={`step-line ${step >= number ? 'active' : ''}`}></div>}
                  <div className={`step ${step >= number ? 'active' : ''}`}>
                    <div className="step-number">{number}</div>
                    <div className="step-label">{label}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step">
                <h2>Personal information</h2>
                <div className="form-row-2">
                  <label><span className="field-label">First name <FieldTag /></span><input required name="firstName" value={formData.firstName} onChange={handleInputChange} /></label>
                  <label><span className="field-label">Last name <FieldTag /></span><input required name="lastName" value={formData.lastName} onChange={handleInputChange} /></label>
                </div>
                <label><span className="field-label">Email <FieldTag /></span><input required type="email" name="email" value={formData.email} onChange={handleInputChange} /></label>
                <label><span className="field-label">Phone <FieldTag /></span><input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} /></label>
                <div className="form-row-2">
                  <label><span className="field-label">Current location <FieldTag /></span>
                    <select required name="location" value={formData.location} onChange={handleInputChange}>
                      <option value="">Select city</option>
                      <option>Hyderabad</option>
                      <option>Bangalore</option>
                      <option>Mumbai</option>
                      <option>Delhi</option>
                      <option>Remote</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label><span className="field-label">Experience <FieldTag /></span>
                    <select required name="experience" value={formData.experience} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option>0-1 years</option>
                      <option>1-2 years</option>
                      <option>3-4 years</option>
                      <option>5-7 years</option>
                      <option>8-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </label>
                </div>
                <label><span className="field-label">LinkedIn profile <FieldTag optional /></span><input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" /></label>
                <label><span className="field-label">Portfolio or GitHub <FieldTag optional /></span><input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="https://github.com/username" /></label>
                {submitError && <div className="form-error">{submitError}</div>}
                <div className="form-buttons end">
                  <Button variant="primary" onClick={goToStepTwo}>Continue</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>Work details</h2>
                <label><span className="field-label">Upload CV / Resume <FieldTag /></span>
                  <input required type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleInputChange} />
                  <span className="file-hint">PDF, DOC, DOCX. Max 5MB.</span>
                </label>
                <label><span className="field-label">Cover note <FieldTag /></span>
                  <textarea required name="coverNote" rows="7" value={formData.coverNote} onChange={handleInputChange} />
                </label>
                <div className="form-row-2">
                  <label><span className="field-label">Notice period <FieldTag optional /></span>
                    <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option>Immediately available</option>
                      <option>2 weeks</option>
                      <option>1 month</option>
                      <option>2 months</option>
                      <option>3 months</option>
                    </select>
                  </label>
                  <label><span className="field-label">How did you hear about us? <FieldTag optional /></span>
                    <select name="source" value={formData.source} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option>LinkedIn</option>
                      <option>Referral</option>
                      <option>Our website</option>
                      <option>Job board</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
                <label className="form-check">
                  <input required type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} />
                  <span>I consent to Lexodd storing my application data for up to 12 months. <FieldTag /></span>
                </label>
                {submitError && <div className="form-error">{submitError}</div>}
                <div className="form-buttons">
                  <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="primary" onClick={goToReview}>Review</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h2>Review your application</h2>
                <div className="review-section">
                  <h3>Personal information</h3>
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Location:</strong> {formData.location}</p>
                  <p><strong>Experience:</strong> {formData.experience}</p>
                </div>
                <div className="review-section">
                  <h3>Work details</h3>
                  <p><strong>CV:</strong> {formData.cv?.name || 'No file selected'}</p>
                  <p><strong>Notice period:</strong> {formData.noticePeriod || 'Not specified'}</p>
                  <p><strong>Source:</strong> {formData.source || 'Not specified'}</p>
                  <p><strong>Cover note:</strong> {formData.coverNote}</p>
                </div>
                {submitError && <div className="form-error">{submitError}</div>}
                <div className="form-buttons">
                  <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                  <button className="submit-application-btn" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplyPage;
