import { Link, useLocation } from 'react-router';
import './navbar.css';
import { useState, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose, IoSearch } from "react-icons/io5";
import { getIndustries, getTechStack } from '../../services/api';
import SearchModal from './SearchModal';
import OptimizedImage from './OptimizedImage';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { pathname } = useLocation();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // MOBILE DRAWERS
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isIndustriesDrawerOpen, setIsIndustriesDrawerOpen] = useState(false);
    const [isResourcesDrawerOpen, setIsResourcesDrawerOpen] = useState(false);

    // DESKTOP DROPDOWNS
    const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Industries from API
    const [industries, setIndustries] = useState([]);
    const [showTechStack, setShowTechStack] = useState(false);

    /* =========================
       NAVBAR HIDE / SHOW
    ========================= */

    useEffect(() => {

        const handleScroll = () => {

            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [lastScrollY]);

    /* =========================
       FETCH INDUSTRIES FROM API
    ========================= */

    useEffect(() => {
        loadIndustries();
        loadTechStackVisibility();
    }, []);

    const loadIndustries = async () => {
        try {
            const response = await getIndustries();
            setIndustries((response.data.data || response.data || []).filter(industry => industry.isVisible !== false));
        } catch (error) {
            console.error('Failed to load industries:', error);
            setIndustries([]);
        }
    };

    const loadTechStackVisibility = async () => {
        try {
            const response = await getTechStack({ skipCache: true });
            const stack = response.data?.data || response.data;
            setShowTechStack(Boolean(stack && stack.isVisible !== false));
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Failed to check tech stack visibility:', error);
            }
            setShowTechStack(false);
        }
    };

    /* =========================
       BODY LOCK
    ========================= */

    useEffect(() => {

        if (
            isMenuOpen ||
            isIndustriesDrawerOpen ||
            isIndustriesOpen ||
            isResourcesDrawerOpen ||
            isResourcesOpen ||
            isSearchOpen
        ) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

    }, [
        isMenuOpen,
        isIndustriesDrawerOpen,
        isIndustriesOpen,
        isResourcesDrawerOpen,
        isResourcesOpen,
        isSearchOpen
    ]);

    /* =========================
       CLOSE ALL
    ========================= */

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsIndustriesDrawerOpen(false);
        setIsIndustriesOpen(false);
        setIsResourcesDrawerOpen(false);
        setIsResourcesOpen(false);
    };

    const openSearch = () => {
        closeAllMenus();
        setIsSearchOpen(true);
    };

    const isActivePath = (paths) => paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    return (
        <>
            <div className={`rad-global-nav ${!isVisible ? 'rad-global-nav--hidden' : ''}`}>

                {/* =========================
                    TOP NAVBAR
                ========================= */}

                <div className="rad-global-nav__wrapper">

                    <nav
                        className="rad-global-nav__container"
                        aria-label="Primary navigation"
                    >

                        {/* LOGO */}
                        <div className="rad-global-nav__logo">
                            <Link
                                to="/"
                                className="rad-global-nav__static-logo"
                                aria-label="Go to homepage"
                            >
                                <OptimizedImage
                                    src="/images/lexodd.svg"
                                    alt="Company logo"
                                    width="40"
                                    height="40"
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="async"
                                />
                                <span className="rad-global-nav__logo-text">Lexodd</span>
                            </Link>


                        </div>

                        {/* DESKTOP NAV */}
                        <div className="rad-global-nav__primary-nav desktop-nav">

                            <ul className="rad-global-nav__menu-items">

                                {/* HOW WE WORK */}
                                <li>
                                    <Link
                                        to="/how-we-work"
                                        className={`rad-button rad-button--ghost ${isActivePath(['/how-we-work']) ? 'active' : ''}`}
                                        onClick={closeAllMenus}
                                    >
                                        <div className="rad-button__text rad-link">
                                            How we work
                                        </div>
                                    </Link>
                                </li>

                                {/* RESOURCES */}
                                <li>

                                    <button
                                        className={`rad-button rad-button--ghost ${isActivePath(['/case-studies', '/white-papers']) ? 'active' : ''}`}
                                        onClick={() => {
                                            setIsResourcesOpen(prev => !prev);
                                            setIsIndustriesOpen(false);
                                        }}
                                        aria-expanded={isResourcesOpen}
                                    >

                                        <div className="rad-button__text">
                                            Resources
                                        </div>

                                        <span className={`chevron-icon ${isResourcesOpen ? 'rotate' : ''}`}>
                                            <MdOutlineKeyboardArrowDown />
                                        </span>

                                    </button>

                                </li>

                                {showTechStack && (
                                    <li>
                                        <Link
                                            to="/tech-stack"
                                            className={`rad-button rad-button--ghost ${isActivePath(['/tech-stack']) ? 'active' : ''}`}
                                            onClick={closeAllMenus}
                                        >
                                            <div className="rad-button__text rad-link">
                                                Tech stack
                                            </div>
                                        </Link>
                                    </li>
                                )}

                                {/* INDUSTRIES */}
                                <li>

                                    <button
                                        className={`rad-button rad-button--ghost ${isActivePath(['/industries']) ? 'active' : ''}`}
                                        onClick={() => {
                                            setIsIndustriesOpen(prev => !prev);
                                            setIsResourcesOpen(false);
                                        }}
                                        aria-expanded={isIndustriesOpen}
                                    >

                                        <div className="rad-button__text">
                                            Industries
                                        </div>

                                        <span className={`chevron-icon ${isIndustriesOpen ? 'rotate' : ''}`}>
                                            <MdOutlineKeyboardArrowDown />
                                        </span>

                                    </button>

                                </li>

                            </ul>

                        </div>

                        {/* DESKTOP CTA */}
                        <div className="rad-global-nav__utility-nav desktop-nav">

                            <button
                                type="button"
                                className="nav-search-btn"
                                onClick={openSearch}
                                aria-label="Open search"
                            >
                                <IoSearch aria-hidden="true" />
                            </button>

                            <ThemeToggle />

                            <Link
                                className='grad-cta cta'
                                to="/contact"
                                aria-label="Start a conversation with us"
                            >
                                <span className='cta-text'>
                                    Start conversation →
                                </span>
                            </Link>

                        </div>

                        <div className="mobile_theme_toggle">
                            <ThemeToggle />
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            className="mobile_menu_btn"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open navigation menu"
                        >
                            <HiOutlineMenuAlt3 />
                        </button>

                    </nav>

                </div>

                {/* =========================
                    DESKTOP RESOURCES DRAWER
                ========================= */}

                <div className={`industries-drawer ${isResourcesOpen ? 'open' : ''}`}>

                    <div className="industries-content">

                        <div className='section'>

                            <div className='container'>

                                <div className='narrow'>
                                    <h2 className='mb-lg'>
                                        Explore resources
                                    </h2>
                                </div>

                                <div className='dr_row'>

                                    <div className='dr_col'>

                                        <Link
                                            to="/case-studies"
                                            className='dr_item'
                                            onClick={closeAllMenus}
                                        >
                                            Case studies
                                        </Link>

                                        <Link
                                            to="/white-papers"
                                            className='dr_item'
                                            onClick={closeAllMenus}
                                        >
                                            White papers
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================
                    DESKTOP INDUSTRIES DRAWER
                ========================= */}

                <div className={`industries-drawer ${isIndustriesOpen ? 'open' : ''}`}>

                    <div className="industries-content">

                        <div className='section'>

                            <div className='container'>

                                <div className='narrow'>
                                    <h2 className='mb-lg'>
                                        Explore featured industries
                                    </h2>
                                </div>

                                <div className='dr_row'>

                                    <div className='dr_col'>

                                        {industries.length > 0 ? (
                                            industries.map((industry) => (
                                                <Link
                                                    key={industry._id}
                                                    to={`/industries/${industry.slug}`}
                                                    className='dr_item'
                                                    onClick={closeAllMenus}
                                                >
                                                    {industry.hero?.title || industry.title || industry.name || industry.slug}
                                                </Link>
                                            ))
                                        ) : (
                                            <>
                                                <Skeleton animation="wave" className="nav-loading-skeleton" width={160} height={24} />
                                                <Skeleton animation="wave" className="nav-loading-skeleton" width={120} height={24} />
                                            </>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================
                    MOBILE MAIN DRAWER
                ========================= */}

                <div className={`mobile_drawer ${isMenuOpen ? 'open' : ''}`}>

                    <div className="mobile_drawer__header">

                        <button
                            className="mobile_close_btn"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close navigation menu"
                        >
                            <IoClose />
                        </button>



                    </div>

                    <div className="mobile_drawer__body">

                        {/* HOW WE WORK */}
                        <Link
                            to="/how-we-work"
                            className="mobile_nav_link"
                            onClick={closeAllMenus}
                        >
                            How we work
                        </Link>





                        {/* RESOURCES */}
                        <button
                            className="mobile_nav_link mobile_industry_btn"
                            onClick={() => {
                                setIsResourcesDrawerOpen(true);
                                setIsIndustriesDrawerOpen(false);
                            }}
                        >

                            <span>
                                Resources
                            </span>

                            <span className="mobile_arrow">
                                →
                            </span>

                        </button>

                        {showTechStack && (
                            <Link
                                to="/tech-stack"
                                className="mobile_nav_link"
                                onClick={closeAllMenus}
                            >
                                Tech stack
                            </Link>
                        )}

                        {/* INDUSTRIES */}
                        <button
                            className="mobile_nav_link mobile_industry_btn"
                            onClick={() => {
                                setIsIndustriesDrawerOpen(true);
                                setIsResourcesDrawerOpen(false);
                            }}
                        >

                            <span>
                                Industries
                            </span>

                            <span className="mobile_arrow">
                                →
                            </span>

                        </button>

                        <button
                            type="button"
                            className="mobile_nav_link mobile_industry_btn"
                            onClick={openSearch}
                        >
                            <span>Search</span>
                            <IoSearch aria-hidden="true" />
                        </button>

                        <div className="mobile_cta_wrap">

                            <Link
                                className='grad-cta cta'
                                to='/contact'
                                onClick={closeAllMenus}
                            >
                                <span className='cta-text'>
                                    Start conversation →
                                </span>
                            </Link>

                        </div>

                    </div>

                </div>

                {/* =========================
                    MOBILE RESOURCES DRAWER
                ========================= */}

                <div className={`mobile_drawer second_drawer ${isResourcesDrawerOpen ? 'open' : ''}`}>

                    <div className="mobile_drawer__header">

                        <button
                            className="mobile_close_btn"
                            onClick={() => setIsResourcesDrawerOpen(false)}
                            aria-label="Close resources menu"
                        >
                            <IoClose />
                        </button>

                    </div>

                    <div className="mobile_drawer__body">

                        <Link
                            to="/case-studies"
                            className="mobile_nav_link"
                            onClick={closeAllMenus}
                        >
                            Case studies
                        </Link>

                        <Link
                            to="/white-papers"
                            className="mobile_nav_link"
                            onClick={closeAllMenus}
                        >
                            White papers
                        </Link>

                    </div>

                </div>

                {/* =========================
                    MOBILE INDUSTRIES DRAWER
                ========================= */}

                <div className={`mobile_drawer second_drawer ${isIndustriesDrawerOpen ? 'open' : ''}`}>

                    <div className="mobile_drawer__header">

                        <button
                            className="mobile_close_btn"
                            onClick={() => setIsIndustriesDrawerOpen(false)}
                            aria-label="Close industries menu"
                        >
                            <IoClose />
                        </button>

                    </div>

                    <div className="mobile_drawer__body">

                        {industries.length > 0 ? (
                            industries.map((industry) => (
                                <Link
                                    key={industry._id}
                                    to={`/industries/${industry.slug}`}
                                    className="mobile_nav_link"
                                    onClick={closeAllMenus}
                                >
                                    {industry.breadcrumb?.current || industry.hero?.title || industry.title || industry.name || industry.slug}
                                </Link>
                            ))
                        ) : (
                            <>
                                <Skeleton animation="wave" className="nav-loading-skeleton mobile-nav-skeleton" width="100%" height={48} />
                                <Skeleton animation="wave" className="nav-loading-skeleton mobile-nav-skeleton" width="82%" height={48} />
                            </>
                        )}

                    </div>

                </div>

            </div>
            <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
