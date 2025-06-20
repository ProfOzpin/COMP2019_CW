import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-title">hoobank</span>
          <p className="footer-desc">A new way to make the payments easy, reliable and secure.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Useful Links</strong>
            <ul>
              <li><a href="https://www.youtube.com/@javascriptmastery">Reference</a></li>
              <li><a href="/help">How it Works</a></li>
              <li><a href="/help">Explore</a></li>
            </ul>
          </div>
          <div>
            <strong>Community</strong>
            <ul>
              <li><a href="https://www.nottingham.edu.my/Study/Make-an-enquiry/Contact-us.aspx">Help Center</a></li>
              <li><a href="https://www.nottingham.edu.my/">University</a></li>
              <li><a href="https://www.nottingham.edu.my/">Newsletters</a></li>
            </ul>
          </div>
          <div>
            <strong>Partner</strong>
            <ul>
              <li><a href="https://www.nottingham.edu.my/">Our Partner</a></li>
              <li><a href="https://www.nottingham.edu.my/Science/People/chew.sze-ker">Our Supervisor</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Copyright © 2022 HooBank. All Rights Reserved.</span>
      </div>
    </footer>
  );
}
