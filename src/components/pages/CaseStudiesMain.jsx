import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Card from '../common/Card';
import Button from '../common/Button';
import api, { getCaseStudies } from '../../services/api';
import MetaTags from '../common/MetaTags';
import { CaseStudiesListingSkeleton } from '../common/Skeletons';
import { FadeUp, StaggerGrid, TextReveal } from '../common/Animations';

const CaseStudiesMain = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [caseStudies, setCaseStudies] = useState([]);
    const [filteredStudies, setFilteredStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroData, setHeroData] = useState({ eyebrow: '', title: '', lead: '' });
    const [seo, setSeo] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);

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
        setVisibleCount(6);
        if (filter === 'All') {
            setFilteredStudies(caseStudies);
        } else {
            setFilteredStudies(caseStudies.filter(study => study.industry === filter));
        }
    };

    if (loading) {
        return <CaseStudiesListingSkeleton />;
    }

    const filters = getUniqueIndustries();
    const visibleStudies = filteredStudies.slice(0, visibleCount);
    const hasMoreStudies = filteredStudies.length > visibleCount;

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
                    <FadeUp className="hero">
                        <div className="ey">Our work</div>
                        <TextReveal as="h1" text="Case Studies" />
                        <p className="lead">Real solutions to real operational challenges</p>
                    </FadeUp>

                    <div className="sec">
                        {caseStudies.length > 0 && (
                            <FadeUp className="filter-row">
                                {filters.map(filter => (
                                    <button
                                        key={filter}
                                        className={`f-btn ${activeFilter === filter ? 'on' : ''}`}
                                        onClick={() => handleFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </FadeUp>
                        )}

                        {filteredStudies.length > 0 ? (
                            <>
                                <StaggerGrid className="grid3">
                                    {visibleStudies.map(study => (
                                        <Card key={study._id} {...study} onClick={() => navigate(`/case-studies/${study.slug}`)} />
                                    ))}
                                </StaggerGrid>
                                {hasMoreStudies && (
                                    <div className="btn-row" style={{ justifyContent: 'center', marginTop: 32 }}>
                                        <Button variant="secondary" onClick={() => setVisibleCount((count) => count + 6)}>
                                            Load more
                                        </Button>
                                    </div>
                                )}
                            </>
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
