import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getJobs } from '../../services/api';
import MetaTags from '../common/MetaTags';
import MinimalJobCard from './MinimalJobCard';
import { OpenRolesSkeleton } from '../common/Skeletons';
import './Careers.css';

const OpenRoles = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRes = await getJobs();
        setJobs((jobsRes.data || []).filter(job => job.isVisible !== false));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const jobsByDepartment = jobs.reduce((acc, job) => {
    const dept = job.dept || 'Open roles';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(job);
    return acc;
  }, {});

  if (loading) {
    return <OpenRolesSkeleton />;
  }

  return (
    <>
      <MetaTags
        title="Open Roles at Lexodd"
        description="Explore current openings at Lexodd and apply directly."
      />
      <div className="container">
        <div className="page">
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
                          onApply={() => navigate(`/apply/${job._id}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">JOB</div>
                    <h3>No open positions</h3>
                    <p>We don't have any open roles right now. Send us your resume anyway.</p>
                  </div>
                )}
              </section>
            </div>
        </div>
      </div>
    </>
  );
};

export default OpenRoles;
