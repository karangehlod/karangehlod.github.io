import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

const Home         = lazy(() => import('./pages/Home'));
const About        = lazy(() => import('./pages/About'));
const Projects     = lazy(() => import('./pages/Projects'));
const ProjectPage  = lazy(() => import('./pages/ProjectPage'));
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
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observe = (el: Element) => {
      if (!el.classList.contains('revealed')) io.observe(el);
    };

    // Allow React to finish rendering before observing
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(observe);
    }, 80);

    // Pick up .reveal elements added after lazy-load or async data fetch
    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.classList.contains('reveal')) observe(node);
          node.querySelectorAll('.reveal:not(.revealed)').forEach(observe);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

function AnimatedPage() {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="animate-page-enter">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/about"          element={<About />} />
          <Route path="/projects"       element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/publications"   element={<Publications />} />
          <Route path="*"               element={<Home />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function Layout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)', color: 'var(--c-text1)' }}>
      <Nav />
      <main>
        <ScrollToTop />
        <RevealObserver />
        <AnimatedPage />
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
