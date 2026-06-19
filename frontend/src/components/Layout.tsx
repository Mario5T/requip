import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Plus, LayoutDashboard } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Users', icon: <LayoutDashboard size={16} /> },
    { to: '/users/create', label: 'Add User', icon: <Plus size={16} /> },
  ];

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <Link to="/" className="layout__logo" style={{ textDecoration: 'none' }}>
            <span className="layout__logo-icon">
              <Users size={18} />
            </span>
            Requip
          </Link>
          <nav className="layout__nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`btn btn--sm ${location.pathname === link.to ? 'btn--primary' : 'btn--ghost'}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="layout__main animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
