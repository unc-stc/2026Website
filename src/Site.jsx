import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { committees, quickLinks } from "./content.js";
import Home from "./pages/Home.jsx";
import Social from "./pages/Social.jsx";
import Construction from "./pages/Construction.jsx";
import NotFound from "./pages/NotFound.jsx";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Horn({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M14 46c8-2 12-10 10-18-2-8 2-14 10-16 10-2 16 6 14 14-2 8-10 12-18 10 2 6 8 10 16 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="46" cy="46" r="4" fill="#F2C14E" />
    </svg>
  );
}

function WellIcon() {
  return (
    <svg className="well-icon" viewBox="0 0 64 72" aria-hidden="true">
      <path d="M10 30c2-14 10-20 22-20s20 6 22 20" fill="none" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="32" cy="30" rx="22" ry="7" fill="#8ecff0" stroke="currentColor" strokeWidth="3" />
      <rect x="16" y="32" width="6" height="24" rx="1" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
      <rect x="42" y="32" width="6" height="24" rx="1" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
      <path d="M12 56h40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const closeOnDesktop = () => {
      if (!query.matches) setOpen(false);
    };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={open ? "nav is-open" : "nav"}>
      <div className="brand">
        <Link to="/" className="brand-name" aria-label="UNC Chapel Hill Student Technology Council home">
          <WellIcon />
          <span className="brand-full">UNC Chapel Hill Student Technology Council</span>
        </Link>
      </div>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="page-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span className="nav-toggle-bars" aria-hidden="true" />
      </button>
      <nav id="page-menu" className="nav-links" aria-label="Pages">
        <NavLink to="/" end>
          Home
        </NavLink>
        {committees.map((committee) => (
          <NavLink key={committee.slug} to={committee.href}>
            {committee.short}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

function DockIcon({ id }) {
  if (id === "confessions") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 8h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H14l-5 5v-5H7a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
      </svg>
    );
  }
  if (id === "council") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 14h20M8 14V26M24 14V26M4 26h24M16 6l12 8H4z" />
      </svg>
    );
  }
  if (id === "linktree") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 5l9 12H7z" />
        <path d="M16 12l7 10H9z" />
        <path d="M16 20v8M12 28h8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="6" y="6" width="20" height="20" rx="6" />
      <circle cx="16" cy="16" r="5" />
      <circle cx="22.5" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Dock() {
  return (
    <nav className="dock" aria-label="STC links">
      {quickLinks.map((link) => (
        <a key={link.id} className="dock-link" href={link.url} target="_blank" rel="noreferrer">
          <DockIcon id={link.id} />
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export default function Site() {
  return (
    <div className="site">
      <ScrollTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/social" element={<Social />} />
          <Route path="/voice" element={<Construction slug="voice" />} />
          <Route path="/edtech" element={<Construction slug="edtech" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Dock />
      <IdleHorns />
    </div>
  );
}

function IdleHorns() {
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("stc-peek") === "1") return undefined;
    } catch {
      return undefined;
    }
    let timer = window.setTimeout(show, 14000);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(show, 14000);
    };
    function show() {
      try {
        sessionStorage.setItem("stc-peek", "1");
      } catch {
        /* ignore */
      }
      setPeek(true);
      window.removeEventListener("pointermove", reset);
    }
    window.addEventListener("pointermove", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", reset);
    };
  }, []);

  if (!peek) return null;
  return (
    <div className="idle-horns" aria-hidden="true">
      <Horn className="horn" />
    </div>
  );
}
