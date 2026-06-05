import React from 'react';

const COLUMNS = [
  {
    heading: 'PLATFORM',
    links: [
      { label: 'Vision', href: '#vision' },
      { label: 'Intelligence Layers', href: '#layers' },
      { label: 'Simulation', href: '#simulation' },
      { label: 'Earth to Village', href: '#earth-to-village' },
    ],
  },
  {
    heading: 'RESOURCES',
    links: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Data Sources', href: '#data' },
      { label: 'GitHub Repository', href: '#github' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Support', href: '#support' },
      { label: 'Privacy Policy', href: '#privacy' },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: 'Twitter', icon: '𝕏', href: '#twitter' },
  { label: 'LinkedIn', icon: 'in', href: '#linkedin' },
  { label: 'GitHub', icon: '⌨', href: '#github-social' },
  { label: 'YouTube', icon: '▶', href: '#youtube' },
];

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top">
        {/* Brand */}
        <div className="footer__brand">
          <div className="navbar__globe" aria-hidden="true" />
          <div className="footer__brand-text">
            <span className="footer__brand-title">BETTER BHARAT MAP</span>
            <span className="footer__brand-tagline">
              EARTH INTELLIGENCE PLATFORM
            </span>
          </div>
        </div>

        {/* Link columns */}
        <div className="footer__columns">
          {COLUMNS.map((col) => (
            <nav className="footer__column" key={col.heading} aria-label={col.heading}>
              <h4 className="footer__column-heading">{col.heading}</h4>
              <ul className="footer__column-list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer__link"
                      id={`footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Vision */}
        <div className="footer__vision">
          <h4 className="footer__column-heading">OUR VISION</h4>
          <p className="footer__vision-text">
            A data-driven India where every decision creates a better future
            for every citizen.
          </p>
        </div>
      </div>

      {/* Social icons */}
      <div className="footer__social">
        {SOCIAL_LINKS.map((social) => (
          <a
            href={social.href}
            className="footer__social-link"
            key={social.label}
            aria-label={social.label}
            id={`footer-social-${social.label.toLowerCase()}`}
          >
            <span className="footer__social-icon" aria-hidden="true">
              {social.icon}
            </span>
          </a>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copyright">
          © 2024 Better Bharat Map. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
