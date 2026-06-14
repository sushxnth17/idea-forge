import Navbar from "./Navbar";

/**
 * AppLayout component sets up the primary responsive shell of IdeaForge.
 * It coordinates with navbar.css to manage:
 * - Desktop: Vertical sidebar layout with shifted main container
 * - Mobile: Sticky header and fixed bottom navigation bar
 */
function AppLayout({ children, className = "" }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main id="main" role="main" className={`app-shell__main ${className}`.trim()}>
        <div className="app-shell__surface">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;