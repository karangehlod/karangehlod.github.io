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
    <div className="min-h-screen flex items-center justify-center bg-ground">
      <div className="w-8 h-8 rounded-full border-2 border-line-strong animate-spin"
           style={{ borderTopColor: 'var(--signal)' }} />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Adds .in to fx-* elements as they enter the viewport (one-shot).
   A MutationObserver picks up async-loaded content (repos, contributions). */
const FX_SELECTOR = '.fx-rise, .fx-head, .fx-rule, .cal-sweep';

function FxObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll(`${FX_SELECTOR}`).forEach(el => {
        if (!el.classList.contains('in')) io.observe(el);
      });
    };

    const timer = setTimeout(() => observeAll(document.body), 60);

    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches(FX_SELECTOR) && !node.classList.contains('in')) io.observe(node);
          observeAll(node);
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
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-ground text-ink">
      <Nav />
      {/* SectionDots lives here — outside AnimatedPage so transform on page-enter never breaks fixed positioning */}
      {pathname === '/' && <SectionDots />}
      <main>
        <ScrollToTop />
        <FxObserver />
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
