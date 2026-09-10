import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { SectionDots } from './pages/Home';

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

/* Global observers — runs on every route change */
function RevealObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. .reveal — one-shot fade-in for general elements (non-home pages)
    const revealIo = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealIo.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    // 2. .section-reveal — replays every time element enters/leaves view
    const sectionIo = new IntersectionObserver(
      entries => entries.forEach(e => {
        e.target.classList.toggle('in', e.isIntersecting);
      }),
      { threshold: 0.12 }
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => revealIo.observe(el));
      document.querySelectorAll('.section-reveal').forEach(el => sectionIo.observe(el));
    };

    const timer = setTimeout(observeAll, 80);

    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.classList.contains('reveal') && !node.classList.contains('revealed'))
            revealIo.observe(node);
          if (node.classList.contains('section-reveal'))
            sectionIo.observe(node);
          node.querySelectorAll('.reveal:not(.revealed)').forEach(el => revealIo.observe(el));
          node.querySelectorAll('.section-reveal').forEach(el => sectionIo.observe(el));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      revealIo.disconnect();
      sectionIo.disconnect();
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
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)', color: 'var(--c-text1)' }}>
      <Nav />
      {/* SectionDots lives here — outside AnimatedPage so transform on page-enter never breaks fixed positioning */}
      {pathname === '/' && <SectionDots />}
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
