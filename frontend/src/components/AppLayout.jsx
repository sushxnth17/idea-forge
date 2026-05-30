import Navbar from "./Navbar";

function AppLayout({ children, className = "" }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className={`app-shell__main ${className}`.trim()}>{children}</main>
    </div>
  );
}

export default AppLayout;