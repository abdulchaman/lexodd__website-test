import React, { useState } from 'react';

const MinimalJobCard = ({ job, onApply }) => {
  const [expanded, setExpanded] = useState(false);
  const requirements = Array.isArray(job.req) ? job.req : [];
  const responsibilities = Array.isArray(job.resp) ? job.resp : [];

  return (
    <div className={`minimal-job-card ${expanded ? 'expanded' : ''}`}>
      <div
        className="job-card-header"
        onClick={() => setExpanded((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setExpanded((value) => !value);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <span className="job-card-main">
          <span className="job-card-title">{job.title}</span>
          <span className="job-meta">
            <span>{job.loc || 'Location flexible'}</span>
            <span aria-hidden="true">.</span>
            <span>{job.type || 'Role type open'}</span>
          </span>
        </span>
        <button
          type="button"
          className="apply-btn-minimal"
          onClick={(event) => {
            event.stopPropagation();
            onApply(job);
          }}
        >
          Apply
        </button>
      </div>

      {expanded && (
        <div className="job-card-details">
          {job.desc && <p>{job.desc}</p>}

          {responsibilities.length > 0 && (
            <>
              <h4>Responsibilities</h4>
              <ul>
                {responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {requirements.length > 0 && (
            <>
              <h4>Requirements</h4>
              <ul>
                {requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MinimalJobCard;
