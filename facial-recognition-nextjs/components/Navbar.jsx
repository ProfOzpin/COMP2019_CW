import Link from "next/link";
import React from "react";
const logo = "/assets/logo.png"; // Ensure logo exists in public/assets

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a href="/" className="navbar-logo">
          <img src="/assets/logo.png" alt="hoobank" className="navbar-logo-img" />
          <span className="navbar-title">hoobank</span>
        </a>
        <ul className="navbar-links">
          <li>
            <Link href="/help" className="navbar-link">Help</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
