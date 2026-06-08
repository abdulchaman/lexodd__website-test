import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { FaChartLine, FaHospital, FaIndustry, FaNetworkWired, FaProjectDiagram, FaTruckMoving } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { getCaseStudies } from "../../services/api";
import "swiper/css";
import "./HomeVideoHero.css";

const introStatements = [
    {
        wrapperClass: "anim-moving-txt",
        textClass: "text-1",
        text: "Your operations outpaced coordination",
    },
    {
        wrapperClass: "name-txt",
        textClass: "text-11",
        text: "Visibility should not arrive late",
    },
    {
        wrapperClass: "name-txt-3",
        textClass: "text-111",
        text: "Do not scale complexity alone",
    },
];

const fallbackCaseStudyCards = [
    {
        _id: "fallback-fuel-logistics",
        title: "Fuel logistics and distribution",
        slug: "",
    },
    {
        _id: "fallback-healthcare",
        title: "Multi-location healthcare coordination",
        slug: "",
    },
    {
        _id: "fallback-franchise",
        title: "Franchise and fleet management",
        slug: "",
    },
    {
        _id: "fallback-visibility",
        title: "Operational visibility systems",
        slug: "",
    },
];

const caseStudyIcons = [
    FaTruckMoving,
    FaHospital,
    FaNetworkWired,
    FaChartLine,
    FaIndustry,
    FaProjectDiagram,
];

const getListFromResponse = (payload, keys = []) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];

    for (const key of ["data", ...keys]) {
        if (Array.isArray(payload[key])) return payload[key];
    }

    if (payload.data && typeof payload.data === "object") {
        return getListFromResponse(payload.data, keys);
    }

    return [];
};

const normalizeCaseStudy = (study = {}) => ({
    _id: study._id || study.id || study.slug || study.title,
    slug: study.slug || study.id || "",
    title: study.title || study.heroDetail?.title || study.hero?.title || "Case study",
    isVisible: study.isVisible,
});

const normalizeCaseStudies = (payload) => getListFromResponse(payload, ["caseStudies", "items", "results"])
    .filter((study) => study && study.isVisible !== false)
    .map(normalizeCaseStudy)
    .filter((study) => study.title)
    .slice(0, 4);

export default function HomeVideoHero({
    desktopVideoSrc,
    mobileVideoSrc,
    posterImage,
}) {
    const rootRef = useRef(null);
    const videoRef = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [showPoster, setShowPoster] = useState(true);
    const [caseStudyCards, setCaseStudyCards] = useState([]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return undefined;
        }

        const playVideo = async () => {
            try {
                await video.play();
                setHasStarted(true);
            } catch (error) {
                setHasStarted(true);
            }
        };

        playVideo();
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchHeroCaseStudies = async () => {
            try {
                const response = await getCaseStudies();
                const studies = normalizeCaseStudies(response.data);

                if (isMounted) {
                    setCaseStudyCards(studies);
                }
            } catch (error) {
                console.error("Error fetching hero case studies:", error);
            }
        };

        fetchHeroCaseStudies();

        return () => {
            isMounted = false;
        };
    }, []);

    useLayoutEffect(() => {
        if (!hasStarted || !rootRef.current) {
            return undefined;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".video-wrap video", {
                scale: 20,
                duration: 2,
                ease: "expo.out",
            });

            tl.to(".anim-moving-txt, .name-txt, .name-txt-3, .nyn-txt", {
                opacity: 1,
                duration: 0.01,
            });

            introStatements.forEach(({ wrapperClass, textClass }) => {
                tl.fromTo(
                    `.${wrapperClass} .${textClass}`,
                    {
                        scale: 5,
                        filter: "blur(15px)",
                        opacity: 0,
                        transformOrigin: "center center",
                    },
                    {
                        scale: 1,
                        filter: "blur(0px)",
                        opacity: 1,
                        duration: 1,
                        ease: "expo.out",
                    },
                    "+=1"
                );

                tl.to(`.${wrapperClass}`, {
                    scale: 0,
                    filter: "blur(15px)",
                    opacity: 0,
                    duration: 1,
                    ease: "expo.out",
                }, "+=1");
            });

            tl.from(".nyn-txt-pos span", {
                scale: 5,
                stagger: 0.3,
                filter: "blur(10px)",
                opacity: 0,
                duration: 2,
                ease: "expo.out",
                onComplete: () => {
                    rootRef.current
                        ?.querySelector(".nyn-txt-pos")
                        ?.classList.add("active");
                },
            }, "+=1");

            tl.from(".searchBoxWrap", {
                opacity: 0,
                y: 50,
                duration: 2,
                ease: "expo.out",
            }, "+=0.35");
        }, rootRef);

        return () => ctx.revert();
    }, [hasStarted]);

    const handleVideoPlay = () => {
        setShowPoster(false);
        setHasStarted(true);
    };

    const handleVideoError = () => {
        setShowPoster(true);
        setHasStarted(true);
    };

    return (
        <section className="home-page-banner hmv_home-page-banner" ref={rootRef}>
            <article
                className="swiper hero-banner-carousel hmv_banner-carousel"
                id="hero-banner"
                aria-label="Hero section"
            >
                <Swiper
                    className="hmv_swiper"
                    slidesPerView={1}
                    spaceBetween={0}
                    grabCursor
                    loop={false}
                >
                    <SwiperSlide className="hmv_slide">
                        <div
                            className={`video-wrap no-overlay hmv_video-wrap ${showPoster ? "hmv_video-wrap--poster" : "hmv_video-wrap--video"}`}
                            style={{ backgroundImage: `url(${posterImage})` }}
                        >
                            <video
                                ref={videoRef}
                                id="hero-video"
                                className="hero-fit hmv_hero-fit"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                poster={posterImage}
                                onCanPlay={handleVideoPlay}
                                onPlaying={handleVideoPlay}
                                onError={handleVideoError}
                                aria-hidden="true"
                            >
                                <source
                                    src={mobileVideoSrc}
                                    type="video/mp4"
                                    media="(max-width: 767px)"
                                />
                                <source
                                    src={desktopVideoSrc}
                                    type="video/mp4"
                                    media="(min-width: 768px)"
                                />
                            </video>
                        </div>

                        <div className="container">
                            <div className="row hero-align-cnt hmv_hero-align-cnt justify-content-center align-items-center text-center z-1">
                                <div className="col-12 hmv_anim-stage">
                                    {introStatements.map(({ wrapperClass, textClass, text }) => (
                                        <div className={wrapperClass} key={text}>
                                            <div className={`${textClass} d-block`}>
                                                <span>{text}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="nyn-txt">
                                        <div className="nyn-txt-pos">
                                            <h1 className="h1-head hmv_h1-head mb-0 text-white">
                                                <span>Design</span>
                                                <span>your</span>
                                                <span>next</span>
                                            </h1>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="col-12 col-lg-11 searchBoxWrap hmv_searchBoxWrap">
                                    <form
                                        className="col-12 search__form position-rel"
                                        id="bannersearchform"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="search-form-inner wow zoomX animatedBlock">
                                            <div className={`chat-error ${showError ? "active" : ""}`}>
                                                <p>Please enter a question or choose one of the suggestions.</p>
                                            </div>
                                            <div className="home-anim-wrap">
                                                <button
                                                    id="btn-search-mic"
                                                    className={`btn btn-search-mic ${isListening ? "listening" : ""}`}
                                                    type="button"
                                                    title="Search with voice"
                                                    onClick={toggleListening}
                                                >
                                                    <span className="hmv_mic-dot" aria-hidden="true" />
                                                </button>
                                                <div className="ai-search-main">
                                                    <textarea
                                                        className="search__input form-control"
                                                        name="k"
                                                        autoComplete="off"
                                                        spellCheck="false"
                                                        aria-multiline="true"
                                                        id="aiSearchText"
                                                        placeholder="Ask me anything"
                                                        value={query}
                                                        onChange={(event) => {
                                                            setQuery(event.target.value);
                                                            setShowError(false);
                                                        }}
                                                    />
                                                    <label htmlFor="aiSearchText">
                                                        <SparkleIcon />
                                                    </label>
                                                </div>
                                                <div className="hmv_search-bottom">
                                                    <ul className="ai-search-recomondations" id="bannerai-recomondations">
                                                        {recommendations.map((item) => (
                                                            <li key={item}>
                                                                <button type="button" onClick={() => handleSuggestionClick(item)}>
                                                                    {item}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <p className="text-grey-800 caution-tag">
                                                        We map friction into visible, accountable operating systems.
                                                    </p>
                                                    <button
                                                        title="Search"
                                                        aria-label="Search"
                                                        type="submit"
                                                        className="cta-btn btn-ai-submit"
                                                        id="bannersearchbtn"
                                                    >
                                                        &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div> */}

                                <div className="col-12 mt-5 searchBoxWrap hmv_storyWrap">
                                    <div className="row">
                                        {(caseStudyCards.length > 0 ? caseStudyCards : fallbackCaseStudyCards).map((card, index) => {
                                            const target = card.slug ? `/case-studies/${card.slug}` : "/case-studies";
                                            const CaseStudyIcon = caseStudyIcons[index % caseStudyIcons.length];

                                            return (
                                            <div className="col-6 col-lg-3 rec-stories-box" key={card.title}>
                                                <div className="rec-stories text-white">
                                                    <CaseStudyIcon className="hmv_story-icon" aria-hidden="true" />
                                                    <h2 className="text-grey-800 h6-head fw-medium truncate-3">
                                                        {card.title}
                                                    </h2>
                                                    <p className="text-grey-800 mb-3 truncate-3">
                                                        <Link className="rad-button rad-button--ghost hmv_case-link" to={target}>
                                                            <span className="rad-button__text rad-link">
                                                                Know more
                                                            </span>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </article>
        </section>
    );
}
