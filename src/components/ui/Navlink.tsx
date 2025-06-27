import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className = "", activeClassName = "" }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <Link to={to} className={combinedClassName}>
      {children}
    </Link>
  );
};

export default NavLink;
