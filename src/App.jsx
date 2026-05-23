import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import Home from './components/pages/Home';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HowWeWork from './components/pages/HowWeWork';
import CaseStudiesMain from './components/pages/CaseStudiesMain';
import CaseStudySingle from './components/pages/CaseStudySingle';
import WhitePapersMain from './components/pages/WhitePapersMain';
import WhitePaperSingle from './components/pages/WhitePaperSingle';
import IndustrySingle from './components/pages/IndustrySingle';
import TechStack from './components/pages/TechStack';
import Careers from './components/pages/Careers';
import OpenRoles from './components/pages/OpenRoles';


import ContactPage from './components/pages/ContactPage';
import TermsConditions from './components/pages/TermsConditions';
import PrivacyPolicy from './components/pages/PrivacyPolicy';

import './styles/global.css';
import './styles/utilities.css';


const routeConfig = [
  { path: "/", Component: Home },
  { path: "/how-we-work", Component: HowWeWork },
  { path: "/case-studies", Component: CaseStudiesMain },
  { path: "/case-studies/:slug", Component: CaseStudySingle },
  { path: "/white-papers", Component: WhitePapersMain },
  { path: "/white-papers/:slug", Component: WhitePaperSingle },
  { path: "/industries/:slug", Component: IndustrySingle },
  { path: "/careers", Component: Careers },
  { path: "/open-roles", Component: OpenRoles },
  { path: "/tech-stack", Component: TechStack },
  { path: "/contact", Component: ContactPage },
  { path: "/terms", Component: TermsConditions },
  { path: "/privacy-policy", Component: PrivacyPolicy },
];

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        {routeConfig.map(({ path, Component }) => {
          return (
            <Route
              key={path}
              path={path}
              element={
                <PageWrapper>
                  <Component />
                </PageWrapper>
              }
            />
          );
        })}
      </Routes>
    </AnimatePresence>
  );
}

// KEY CHANGE: Scroll happens BEFORE the animation starts
function PageWrapper({ children }) {
  // Scroll to top immediately when component is about to mount
  useEffect(() => {
    // Force scroll to top before any rendering
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means it runs once when the page mounts

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1,
        ease: [0.85, 0, 0, 1],
      }}
      style={{
        transitionProperty: "opacity",
      }}
    >
      {children}
    </motion.div>
  );
}

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Navbar />
        <div className="main">
          <AnimatedRoutes />
        </div>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
