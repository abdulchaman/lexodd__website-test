import React, { useState, useEffect } from 'react';
import Footer from '../common/Footer';
import { getCareerPage, getJobs, submitApplication } from '../../services/api';
import MetaTags from '../common/MetaTags';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
import './Careers.css';

const Careers = () => {
  const [activeView, setActiveView] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [currentJob, setCurrentJob] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [checkedDepts, setCheckedDepts] = useState([]);
  const [checkedLocs, setCheckedLocs] = useState([]);
  const [checkedTypes, setCheckedTypes] = useState([]);
  const [checkedExps, setCheckedExps] = useState([]);

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
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      const [pageRes, jobsRes] = await Promise.all([
        getCareerPage(),
        getJobs()
      ]);
      setCareerData(pageRes.data.data || pageRes.data);
      setJobs(jobsRes.data.data || []);
      setFilteredJobs(jobsRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching career data:', error);
      setLoading(false);
    }
  };

  const { hero, values, cta } = careerData || { hero: {}, values: {}, cta: {} };

  // Get unique values for filters
  const departments = [...new Set(jobs.map(job => job.dept))];
  const locations = [...new Set(jobs.map(job => job.loc))];
  const types = [...new Set(jobs.map(job => job.type))];
  const experiences = [...new Set(jobs.map(job => job.exp))];

  // Apply filters
  useEffect(() => {
    let filtered = [...jobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.dept.toLowerCase().includes(query) ||
        job.desc.toLowerCase().includes(query) ||
        (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    if (filterLocation) {
      filtered = filtered.filter(job => job.loc === filterLocation);
    }

    if (filterType) {
      filtered = filtered.filter(job => job.type === filterType);
    }

    if (filterDept) {
      filtered = filtered.filter(job => job.dept === filterDept);
    }

    if (checkedDepts.length) {
      filtered = filtered.filter(job => checkedDepts.includes(job.dept));
    }

    if (checkedLocs.length) {
      filtered = filtered.filter(job => checkedLocs.includes(job.loc));
    }

    if (checkedTypes.length) {
      filtered = filtered.filter(job => checkedTypes.includes(job.type));
    }

    if (checkedExps.length) {
      filtered = filtered.filter(job => checkedExps.includes(job.exp));
    }

    setFilteredJobs(filtered);
  }, [searchQuery, filterLocation, filterType, filterDept, checkedDepts, checkedLocs, checkedTypes, checkedExps, jobs]);

  const getTagClass = (type) => {
    if (type === 'Full-time') return 'tg';
    if (type === 'Contract') return 'tb';
    return 'ta';
  };

  const handleCheckboxChange = (category, value) => {
    let setter;
    let current;
    switch (category) {
      case 'dept':
        current = checkedDepts;
        setter = setCheckedDepts;
        break;
      case 'loc':
        current = checkedLocs;
        setter = setCheckedLocs;
        break;
      case 'type':
        current = checkedTypes;
        setter = setCheckedTypes;
        break;
      case 'exp':
        current = checkedExps;
        setter = setCheckedExps;
        break;
      default:
        return;
    }

    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterLocation('');
    setFilterType('');
    setFilterDept('');
    setCheckedDepts([]);
    setCheckedLocs([]);
    setCheckedTypes([]);
    setCheckedExps([]);
  };

  const hasActiveFilters = searchQuery || filterLocation || filterType || filterDept ||
    checkedDepts.length || checkedLocs.length || checkedTypes.length || checkedExps.length;

  const openApplyModal = (job) => {
    setCurrentJob(job);
    setApplyStep(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDepartmentCount = (dept) => {
    return jobs.filter(job => job.dept === dept).length;
  };

  const getLocationCount = (loc) => {
    return jobs.filter(job => job.loc === loc).length;
  };

  const getTypeCount = (type) => {
    return jobs.filter(job => job.type === type).length;
  };

  const getExpCount = (exp) => {
    return jobs.filter(job => job.exp === exp).length;
  };

  // Group jobs by department for the list view
  const jobsByDepartment = filteredJobs.reduce((acc, job) => {
    if (!acc[job.dept]) acc[job.dept] = [];
    acc[job.dept].push(job);
    return acc;
  }, {});

  return (
    <>
    <MetaTags
      title={careerData?.seo?.metaTitle || 'Careers at Lexodd'}
      description={careerData?.seo?.metaDescription || 'Join our team of systems thinkers'}
      keywords={careerData?.seo?.metaKeywords}
      ogTitle={careerData?.seo?.ogTitle}
      ogDescription={careerData?.seo?.ogDescription}
      ogImage={careerData?.seo?.ogImage?.url}
      canonicalUrl={careerData?.seo?.canonicalUrl}
      robots={careerData?.seo?.robots}
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
            {/* View Tabs */}
            <div className="view-tabs">
              <button
                className={`vtab ${activeView === 'overview' ? 'cur' : ''}`}
                onClick={() => setActiveView('overview')}
              >
                Overview
              </button>
              <button
                className={`vtab ${activeView === 'roles' ? 'cur' : ''}`}
                onClick={() => setActiveView('roles')}
              >
                Open roles <span className="role-badge">{jobs.length}</span>
              </button>
            </div>

            {/* Overview View */}
            {activeView === 'overview' && (
              <div className="view-content">
                <div className="hero-split">
                  <div>
                    <div className="ey">{hero.eyebrow}</div>
                    <h1>{hero.title}</h1>
                    <p className="lead">{hero.lead}</p>
                    <div className="hero-buttons">
                      <button className="btn-p" onClick={() => setActiveView('roles')}>See open roles</button>
                      <button className="btn-o">How we work</button>
                    </div>
                    <div className="hero-stats">
                      <div className="hs-item">
                        <div className="hs-n">{hero.stats?.openRoles || 0}</div>
                        <div className="hs-l">Open roles</div>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="hs-item">
                        <div className="hs-n">{hero.stats?.activeLocations || 0}</div>
                        <div className="hs-l">Active locations</div>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="hs-item">
                        <div className="hs-n">{hero.stats?.teamSize || '~12'}</div>
                        <div className="hs-l">Team size</div>
                      </div>
                    </div>
                  </div>
                  <div className="img-ph hero-image">
                    {hero.heroImage ? (
                      <img
                        src={getImageUrl(hero.heroImage)}
                        alt={getImageAlt(hero.heroImage, 'Careers hero')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = getImagePlaceholder(hero.heroImage, 'Image failed to load');
                        }}
                      />
                    ) : (getImagePlaceholder(hero.heroImage, 'CMS — hero image'))}
                  </div>
                </div>

                <div className="values-section">
                  <div className="cms">CMS — editable: values, descriptions</div>
                  <div className="values-grid-2col">
                    <div>
                      <div className="sl">How we work as a team</div>
                      <h2>{values.title}</h2>
                      <p className="body mt-2">{values.description}</p>
                      <p className="body mt-2">{values.additional}</p>
                      <div className="mt-3">
                        <button className="btn-o btn-sm" onClick={() => setActiveView('roles')}>Browse open roles →</button>
                      </div>
                    </div>
                    <div className="img-ph culture-image">
                      {values.cultureImage ? (
                        <img
                          src={getImageUrl(values.cultureImage)}
                          alt={getImageAlt(values.cultureImage, 'Culture')}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = getImagePlaceholder(values.cultureImage, 'Image failed to load');
                          }}
                        />
                      ) : (getImagePlaceholder(values.cultureImage, 'CMS — culture image'))}
                    </div>
                  </div>
                  <div className="values-grid">
                    {values.items && values.items.map((item, index) => (
                      <div className="val" key={index}>
                        <div className="v-num">{item.number}</div>
                        <h3>{item.title}</h3>
                        <p className="body">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cta-section">
                  <div className="cta-grid">
                    <div className="cta-box">
                      <div className="sl">{cta.eyebrow}</div>
                      <h2 className="mb-2">{cta.title}</h2>
                      <p className="body mb-3">{cta.description}</p>
                      <button className="btn-p">{cta.buttonText}</button>
                    </div>
                    <div className="img-ph workspace-image">
                      {cta.workspaceImage ? (
                        <img
                          src={getImageUrl(cta.workspaceImage)}
                          alt={getImageAlt(cta.workspaceImage, 'Workspace')}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = getImagePlaceholder(cta.workspaceImage, 'Image failed to load');
                          }}
                        />
                      ) : (getImagePlaceholder(cta.workspaceImage, 'CMS — workspace image'))}
                    </div>
                  </div>
                </div>

                <Footer />
              </div>
            )}

            {/* Roles View */}
            {activeView === 'roles' && (
              <div className="view-content">
                {/* Filter Bar */}
                <div className="filter-bar">
                  <div className="search-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search roles, skills, keywords…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="filter-sep"></div>
                  <select
                    className="filter-select"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="">All locations</option>
                    {locations.map(loc => <option key={loc}>{loc}</option>)}
                  </select>
                  <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">All types</option>
                    {types.map(type => <option key={type}>{type}</option>)}
                  </select>
                  <select
                    className="filter-select"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="">All departments</option>
                    {departments.map(dept => <option key={dept}>{dept}</option>)}
                  </select>
                  <button
                    className={`clear-btn ${hasActiveFilters ? 'vis' : ''}`}
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                  <span className="results-count">{filteredJobs.length} of {jobs.length} roles</span>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="active-filters">
                    {searchQuery && (
                      <span className="af-pill">
                        "{searchQuery}"
                        <span className="af-x" onClick={() => setSearchQuery('')}>×</span>
                      </span>
                    )}
                    {filterLocation && (
                      <span className="af-pill">
                        {filterLocation}
                        <span className="af-x" onClick={() => setFilterLocation('')}>×</span>
                      </span>
                    )}
                    {filterType && (
                      <span className="af-pill">
                        {filterType}
                        <span className="af-x" onClick={() => setFilterType('')}>×</span>
                      </span>
                    )}
                    {filterDept && (
                      <span className="af-pill">
                        {filterDept}
                        <span className="af-x" onClick={() => setFilterDept('')}>×</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Jobs Layout */}
                <div className="jobs-layout">
                  <div className="jobs-sidebar">
                    <div className="sidebar-section">
                      <div className="ss-title">Department</div>
                      {departments.map(dept => (
                        <div className="ss-option" key={dept}>
                          <input
                            type="checkbox"
                            id={`cb-dept-${dept}`}
                            checked={checkedDepts.includes(dept)}
                            onChange={() => handleCheckboxChange('dept', dept)}
                          />
                          <label htmlFor={`cb-dept-${dept}`}>
                            {dept}
                            <span className="ss-count">{getDepartmentCount(dept)}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="sidebar-section">
                      <div className="ss-title">Location</div>
                      {locations.map(loc => (
                        <div className="ss-option" key={loc}>
                          <input
                            type="checkbox"
                            id={`cb-loc-${loc}`}
                            checked={checkedLocs.includes(loc)}
                            onChange={() => handleCheckboxChange('loc', loc)}
                          />
                          <label htmlFor={`cb-loc-${loc}`}>
                            {loc}
                            <span className="ss-count">{getLocationCount(loc)}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="sidebar-section">
                      <div className="ss-title">Type</div>
                      {types.map(type => (
                        <div className="ss-option" key={type}>
                          <input
                            type="checkbox"
                            id={`cb-type-${type}`}
                            checked={checkedTypes.includes(type)}
                            onChange={() => handleCheckboxChange('type', type)}
                          />
                          <label htmlFor={`cb-type-${type}`}>
                            {type}
                            <span className="ss-count">{getTypeCount(type)}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="sidebar-section">
                      <div className="ss-title">Experience</div>
                      {experiences.map(exp => (
                        <div className="ss-option" key={exp}>
                          <input
                            type="checkbox"
                            id={`cb-exp-${exp}`}
                            checked={checkedExps.includes(exp)}
                            onChange={() => handleCheckboxChange('exp', exp)}
                          />
                          <label htmlFor={`cb-exp-${exp}`}>
                            {exp}+ years
                            <span className="ss-count">{getExpCount(exp)}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="jobs-main">
                    <div className="jobs-list">
                      {Object.entries(jobsByDepartment).map(([dept, deptJobs]) => (
                        <div key={dept}>
                          <div className="dept-header">
                            {dept} · {deptJobs.length} role{deptJobs.length > 1 ? 's' : ''}
                          </div>
                          {deptJobs.map(job => (
                            <div
                              key={job._id || job.id}
                              className={`job-row ${selectedJob?._id === job._id ? 'selected' : ''}`}
                              onClick={() => setSelectedJob(job)}
                            >
                              <div>
                                <div className="jr-tags">
                                  <span className={`tag ${getTagClass(job.type)}`}>{job.type}</span>
                                  <span className="tag tp2">{job.dept}</span>
                                </div>
                                <div className="jr-title">{job.title}</div>
                                <div className="jr-meta">
                                  <span>📍 {job.loc}</span>
                                  <span>⏱ {job.exp} yrs</span>
                                </div>
                              </div>
                              <div className="job-actions">
                                <button
                                  className="btn-p btn-sm"
                                  onClick={(e) => { e.stopPropagation(); openApplyModal(job); }}
                                >
                                  Apply
                                </button>
                                <span className="view-details">View details →</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                      {filteredJobs.length === 0 && (
                        <div className="no-results">
                          <div className="no-results-icon">—</div>
                          <div className="no-results-title">No roles match these filters</div>
                          <div className="no-results-text">
                            Try adjusting your search or <span className="clear-filters-link" onClick={clearFilters}>clear all filters</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detail Panel */}
                    <div className={`detail-panel ${selectedJob ? 'open' : ''}`}>
                      {selectedJob && (
                        <>
                          <div className="dp-header">
                            <div className="dp-tags">
                              <span className={`tag ${getTagClass(selectedJob.type)}`}>{selectedJob.type}</span>
                              <span className="tag tp2">{selectedJob.dept}</span>
                            </div>
                            <div className="dp-title">{selectedJob.title}</div>
                            <div className="dp-meta">
                              <span>📍 {selectedJob.loc}</span>
                              <span>⏱ {selectedJob.exp}+ years</span>
                              <span>🏢 {selectedJob.type}</span>
                            </div>
                            <div className="dp-actions">
                              <button className="btn-p" onClick={() => openApplyModal(selectedJob)}>Apply now</button>
                              <button className="btn-o btn-sm">Save role</button>
                            </div>
                          </div>
                          <div className="dp-section">
                            <h4>About the role</h4>
                            <p>{selectedJob.desc}</p>
                          </div>
                          <div className="dp-section">
                            <h4>Responsibilities</h4>
                            <ul>
                              {selectedJob.resp && selectedJob.resp.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                          </div>
                          <div className="dp-section">
                            <h4>Requirements</h4>
                            <ul>
                              {selectedJob.req && selectedJob.req.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                          </div>
                          {selectedJob.nice && selectedJob.nice.length > 0 && (
                            <div className="dp-section">
                              <h4>Nice to have</h4>
                              <ul>
                                {selectedJob.nice.map((n, i) => <li key={i}>{n}</li>)}
                              </ul>
                            </div>
                          )}
                          <div className="dp-footer">
                            <button className="btn-p full-width" onClick={() => openApplyModal(selectedJob)}>Apply for this role</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Footer />
              </div>
            )}

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

export default Careers;
