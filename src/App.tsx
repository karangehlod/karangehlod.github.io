import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

const Home         = lazy(() => import('./pages/Home'));
const About        = lazy(() => import('./pages/About'));
const Projects     = lazy(() => import('./pages/Projects'));
const Publications = lazy(() => import('./pages/Publications'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--c-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Global IntersectionObserver for all .reveal elements — runs on every route change */
function RevealObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    // Allow React to finish rendering before observing
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
    }, 80);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

function Layout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)', color: 'var(--c-text1)' }}>
      <Nav />
      <main>
        <ScrollToTop />
        <RevealObserver />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/about"        element={<About />} />
            <Route path="/projects"     element={<Projects />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="*"             element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout />
      </HashRouter>
    </ThemeProvider>
  );
}
