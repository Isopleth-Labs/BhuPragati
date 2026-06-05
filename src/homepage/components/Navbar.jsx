const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Data Insights', href: '#data-insights' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <a href="#top" className="navbar__brand" aria-label="Better Bharat Map home">
        <span className="navbar__globe" aria-hidden="true">
          <span className="navbar__globe-ring" />
          <span className="navbar__globe-line navbar__globe-line--vertical" />
          <span className="navbar__globe-line navbar__globe-line--horizontal" />
        </span>
        <div className="navbar__brand-text">
          <span className="navbar__brand-name">BETTER BHARAT MAP</span>
          <span className="navbar__brand-sub">EARTH INTELLIGENCE PLATFORM</span>
        </div>
      </a>

      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="navbar__link"
              id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
