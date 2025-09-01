import React from "react";
import { Link, useLocation } from "react-router-dom";

type LinkProps = React.ComponentProps<typeof Link>;

interface NavLinkProps extends Omit<LinkProps, "to"> {
  to: string;
  className?: string;
  activeClassName?: string;
  /** Se true, considera ativo apenas quando o path for exatamente igual a `to`. */
  exact?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className = "",
  activeClassName = "",
  exact = true,
  ...rest
}) => {
  const location = useLocation();

  const isActive = exact
    ? location.pathname === to
    : location.pathname === to || location.pathname.startsWith(to + "/");

  const combinedClassName = `${className} ${isActive ? activeClassName : ""}`.trim();

  return (
    <Link to={to} className={combinedClassName} {...rest}>
      {children}
    </Link>
  );
};

export default NavLink;
