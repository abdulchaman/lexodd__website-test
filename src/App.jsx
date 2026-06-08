import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import RouteFallback, { HomeRouteFallback } from './components/common/RouteFallback';
import { ScrollProgress } from './components/common/Animations';
import { ThemeProvider } from './context/ThemeContext';
import { prefetchCriticalRoutes } from './utils/performance';

import './styles/global.css';
import './styles/utilities.css';

const Home = lazy(() => import('./components/pages/Home'));
const HowWeWork = lazy(() => import('./components/pages/HowWeWork'));
const CaseStudiesMain = lazy(() => import('./components/pages/CaseStudiesMain'));
const CaseStudySingle = lazy(() => import('./components/pages/CaseStudySingle'));
const WhitePapersMain = lazy(() => import('./components/pages/WhitePapersMain'));
const WhitePaperSingle = lazy(() => import('./components/pages/WhitePaperSingle'));
const IndustrySingle = lazy(() => import('./components/pages/IndustrySingle'));
const TechStack = lazy(() => import('./components/pages/TechStack'));
const Careers = lazy(() => import('./components/pages/Careers'));
const OpenRoles = lazy(() => import('./components/pages/OpenRoles'));
const ApplyPage = lazy(() => import('./components/pages/ApplyPage'));
const ContactPage = lazy(() => import('./components/pages/ContactPage'));
const TermsConditions = lazy(() => import('./components/pages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'));
const NotFound = lazy(() => import('./components/pages/NotFound'));

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
  { path: "/apply/:jobId", Component: ApplyPage },
  { path: "/tech-stack", Component: TechStack },
  { path: "/contact", Component: ContactPage },
  { path: "/terms", Component: TermsConditions },
  { path: "/privacy-policy", Component: PrivacyPolicy },
];

function PageRoutes() {
  const location = useLocation();
  const suspenseFallback = location.pathname === "/" ? <HomeRouteFallback /> : <RouteFallback />;

  return (
    <Suspense fallback={suspenseFallback}>
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
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </Suspense>
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
    <>
      {children}
    </>
  );
}

const App = () => {
  useEffect(() => {
    prefetchCriticalRoutes();
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollProgress />
          <Navbar />
          <div className="main">
            <PageRoutes />
          </div>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
