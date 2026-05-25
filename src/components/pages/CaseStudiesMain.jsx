import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Card from '../common/Card';
import api, { getCaseStudies } from '../../services/api';
import MetaTags from '../common/MetaTags';

const CaseStudiesMain = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [caseStudies, setCaseStudies] = useState([]);
    const [filteredStudies, setFilteredStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroData, setHeroData] = useState({ eyebrow: '', title: '', lead: '' });
    const [seo, setSeo] = useState(null);

    useEffect(() => {
        fetchCaseStudies();
        fetchPageSEO();
    }, []);

    const fetchPageSEO = async () => {
        try {
            const response = await api.get('/pages/case-studies/seo');
            setSeo(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching case studies SEO:', error);
        }
    };

    const fetchCaseStudies = async () => {
        try {
            const response = await getCaseStudies();
            const studies = (response.data.data || response.data || []).filter(study => study.isVisible !== false);
            setCaseStudies(studies);
            setFilteredStudies(studies);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching case studies:', error);
            setLoading(false);
        }
    };

    // Get unique industries for filters from API data
    const getUniqueIndustries = () => {
        const industries = ['All', ...new Set(caseStudies.map(study => study.industry).filter(Boolean))];
        return industries;
    };

    const handleFilter = (filter) => {
        setActiveFilter(filter);
        if (filter === 'All') {
            setFilteredStudies(caseStudies);
        } else {
            setFilteredStudies(caseStudies.filter(study => study.industry === filter));
        }
    };

    if (loading) {
        return (
            <div className='container'>
                <div className="page">
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>Loading case studies...</p>
                    </div>
                </div>
            </div>
        );
    }

    const filters = getUniqueIndustries();

    return (
        <>
            <MetaTags
                title={seo?.metaTitle || 'Case Studies'}
                description={seo?.metaDescription || 'Real-world operational transformations'}
                keywords={seo?.metaKeywords}
                ogTitle={seo?.ogTitle}
                ogDescription={seo?.ogDescription}
                ogImage={seo?.ogImage?.url}
                canonicalUrl={seo?.canonicalUrl}
                robots={seo?.robots}
            />
            <div className='container'>
                <div className="page">
                    <div className="hero">
                        <div className="ey">Our work</div>
                        <h1>Case Studies</h1>
                        <p className="lead">Real solutions to real operational challenges</p>
                    </div>

                    <div className="sec">
                        {caseStudies.length > 0 && (
                            <div className="filter-row">
                                {filters.map(filter => (
                                    <button
                                        key={filter}
                                        className={`f-btn ${activeFilter === filter ? 'on' : ''}`}
                                        onClick={() => handleFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        )}

                        {filteredStudies.length > 0 ? (
                            <div className="grid3">
                                {filteredStudies.map(study => (
                                    <Card key={study._id} {...study} onClick={() => navigate(`/case-studies/${study.slug}`)} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">CS</div>
                                <h3>No case studies yet</h3>
                                <p>Check back soon for our latest work.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CaseStudiesMain;
