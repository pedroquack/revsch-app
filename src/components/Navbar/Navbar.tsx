import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const NAV_ROUTES = [
  { to: "/", label: "Produtos", end: true },
  { to: "/categorias", label: "Categorias", end: false },
  { to: "/segmentos", label: "Segmentos", end: false },
  { to: "/lojas", label: "Lojas", end: false },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top">
          <Link to="/" className="brand">
            <span>RevSearch</span>
            <span className="brand-badge">Reviews</span>
          </Link>
        </div>

        <nav aria-label="Navegação principal">
          <ul className="navbar-links">
            {NAV_ROUTES.map((route) => (
              <li key={route.to}>
                <NavLink
                  to={route.to}
                  end={route.end}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
