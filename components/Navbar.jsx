import Link from "next/link";
import React from "react";

const logo = "/assets/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <img src={logo} alt="Imag.e" className="navbar-logo-img" />

      <ul className="navbar-links">
        <li className="navbar-link-item">
          <Link href="/" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-link-item">
          <Link href="/upload" className="navbar-link">Upload</Link>
        </li>
        <li className="navbar-link-item">
          <Link href="/dashboard" className="navbar-link">Dashboard</Link>
        </li>
        <li className="navbar-link-item">
          <Link href="/help" className="navbar-link">Help</Link>
        </li>
      </ul>
    </nav>
  );
}
