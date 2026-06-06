import "./footer.css";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getIndustries } from "../../services/api";
import OptimizedImage from "./OptimizedImage";
// import BackgroundSVG from "./BackgroundSVG";

/* --- Custom Icons --- */

function MailIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 7 8-7v10H4z" />
        </svg>
    );
}

function PhoneIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
        </svg>
    );
}

function LinkedInIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.777 13.019H3.56V9h3.554v11.452z" />
        </svg>
    );
}

function FacebookIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.326v21.348C0 23.405.595 24 1.326 24H12.82v-9.294H9.692V11.06h3.128V8.412c0-3.1 1.894-4.788 4.658-4.788 1.325 0 2.466.099 2.797.143v3.24h-1.92c-1.506 0-1.797.716-1.797 1.765v2.314h3.587l-.467 3.647h-3.12V24h6.116C23.405 24 24 23.405 24 22.674V1.326C24 .595 23.405 0 22.675 0z" />
        </svg>
    );
}

function InstagramIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 1.8h8.5c2.18 0 3.95 1.77 3.95 3.95v8.5c0 2.18-1.77 3.95-3.95 3.95h-8.5c-2.18 0-3.95-1.77-3.95-3.95v-8.5c0-2.18 1.77-3.95 3.95-3.95zm8.95 1.3a1.15 1.15 0 100 2.3 1.15 1.15 0 000-2.3zM12 7.1a4.9 4.9 0 100 9.8 4.9 4.9 0 000-9.8zm0 1.8a3.1 3.1 0 110 6.2 3.1 3.1 0 010-6.2z" />
        </svg>
    );
}

function YouTubeIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M23.498 6.186a2.997 2.997 0 00-2.11-2.12C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.388.566a2.997 2.997 0 00-2.11 2.12A31.24 31.24 0 000 12a31.24 31.24 0 00.502 5.814 2.997 2.997 0 002.11 2.12C4.7 20.5 12 20.5 12 20.5s7.3 0 9.388-.566a2.997 2.997 0 002.11-2.12A31.24 31.24 0 0024 12a31.24 31.24 0 00-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
        </svg>
    );
}

/* --- Footer --- */

export default function Footer() {
    const [industries, setIndustries] = useState(null);

    useEffect(() => {
        const loadIndustries = async () => {
            try {
                const response = await getIndustries();
                setIndustries((response.data.data || response.data || []).filter(industry => industry.isVisible !== false));
            } catch (error) {
                console.error('Failed to load footer industries:', error);
                setIndustries([]);
            }
        };

        loadIndustries();
    }, []);

    return (
        <>
            <footer className="footer section">
                <div className="footer-container container">

                    <div className="footer-grid">

                        {/* LEFT */}
                        <div className="ft_top1">

                            <div className="footer-branding">

                                <OptimizedImage
                                    src="/images/lexodd.svg"
                                    alt="Lexodd Hypernova logo"
                                    className="footer-logo"
                                    width="40"
                                    height="40"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span className="footer-logo-text">Lexodd</span>
                            </div>
                            <p className="footer-text">
                                Operational infrastructure for businesses that have outgrown manual coordination.
                            </p>

                        </div>

                        {/* RIGHT */}
                        <div className="ft_top2">

                            {/* NAVIGATION */}
                            <div className="ft_col">

                                <div className="footer-heading ft_how">
                                    <Link
                                        to="/how-we-work"
                                        aria-label="Learn how Lexodd works"
                                    >
                                        How We Work
                                    </Link>
                                </div>

                                <div className="footer-links">
                                    {/* <Link
                                        to="/careers"
                                        aria-label="Explore Lexodd careers"
                                    >
                                        Careers
                                    </Link> */}
                                    {/* <Link
                                        to="/contact"
                                        aria-label="Contact Lexodd"
                                    >
                                        Contact
                                    </Link> */}

                                </div>

                            </div>


                            {/* NAVIGATION */}
                            <div className="ft_col">

                                <div className="footer-heading">
                                    Resources
                                </div>

                                <div className="footer-links">

                                    {/* <Link
                                        to="/how-we-work"
                                        aria-label="Learn how Lexodd works"
                                    >
                                        How We Work
                                    </Link> */}

                                    <Link
                                        to="/case-studies"
                                        aria-label="View Lexodd case studies"
                                    >
                                        Case Studies
                                    </Link>

                                    <Link
                                        to="/white-papers"
                                        aria-label="Read Lexodd white papers"
                                    >
                                        White Papers
                                    </Link>

                                    {/* <Link
                                        to="/careers"
                                        aria-label="Explore Lexodd careers"
                                    >
                                        Careers
                                    </Link> */}
                                    {/* <Link
                                        to="/contact"
                                        aria-label="Contact Lexodd"
                                    >
                                        Contact
                                    </Link> */}

                                </div>

                            </div>

                            {/* INDUSTRIES */}
                            <div className="ft_col">

                                <div className="footer-heading">
                                    Industries
                                </div>

                                <div className="footer-links">

                                    {industries === null ? (
                                        <span className="footer-skeleton-list" aria-label="Industries are being fetched">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <span className="footer-skeleton-line" key={index} aria-hidden="true" />
                                            ))}
                                        </span>
                                    ) : industries.length > 0 ? (
                                        industries.map((industry) => (
                                            <Link
                                                key={industry._id || industry.slug}
                                                to={`/industries/${industry.slug}`}
                                                aria-label={`Explore ${industry.hero?.title || industry.title || industry.name || industry.slug}`}
                                            >
                                                {industry.hero?.title || industry.title || industry.name || industry.slug}
                                            </Link>
                                        ))
                                    ) : (
                                        null
                                    )}

                                </div>

                            </div>

                            {/* CONTACT */}
                            <div className="ft_col">

                                <div className="footer-heading">
                                    Contact
                                </div>

                                <div className="footer-links">


                                    <a
                                        href="mailto:info@lexodd.com"
                                        className="footer-inline"
                                        aria-label="Send email to Lexodd"
                                    >
                                        <MailIcon className="icon" />
                                        info@lexodd.com
                                    </a>

                                    <a
                                        href="tel:+919100113290"
                                        className="footer-inline"
                                        aria-label="Call Lexodd"
                                    >
                                        <PhoneIcon className="icon" />
                                        +91 9100113290
                                    </a>

                                    <a
                                        href="https://maps.app.goo.gl/8445wDX3UdEcZEiLA"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="View Lexodd office location on Google Maps"
                                    >
                                        Office number 202,203, Saptagiri Towers, Mayur Marg, Begumpet, Hyderabad, Telangana 500016
                                    </a>

                                    {/* SOCIALS */}

                                    <div className="footer-socials">

                                        <a
                                            href="https://linkedin.com/company/lexodd-hypernova"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Visit Lexodd LinkedIn page"
                                        >
                                            <LinkedInIcon className="icon" />
                                        </a>

                                        <a
                                            href="https://www.instagram.com/lexoddhypernova/?hl=en"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Visit Lexodd Instagram page"
                                        >
                                            <InstagramIcon className="icon" />
                                        </a>

                                        <a
                                            href="https://www.facebook.com/profile.php?id=61585909160418"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Visit Lexodd Facebook page"
                                        >
                                            <FacebookIcon className="icon" />
                                        </a>

                                        <a
                                            href="https://www.youtube.com/@LexoddHypernovaPvtLtd"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Visit Lexodd YouTube channel"
                                        >
                                            <YouTubeIcon className="icon" />
                                        </a>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* BOTTOM */}

                    <div className="footer-bottom">

                        <div>
                            © 2026 Lexodd Hypernova Pvt Ltd. All rights reserved.
                        </div>

                        <div className="footer-bottom-links">
                            <Link
                                to="/careers"
                                aria-label="Explore Lexodd careers"
                            >
                                Careers
                            </Link>

                            <Link
                                to="/privacy-policy"
                                aria-label="Read privacy policy"
                            >
                                Privacy Policy
                            </Link>

                            <Link
                                to="/terms"
                                aria-label="Read terms and conditions"
                            >
                                Terms
                            </Link>

                        </div>

                    </div>

                </div>
            </footer>
        </>
    );
}
