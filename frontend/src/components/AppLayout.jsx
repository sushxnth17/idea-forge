import Navbar from "./Navbar";

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