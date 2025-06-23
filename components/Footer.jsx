import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
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
      </div>
    </footer>
  );
}
