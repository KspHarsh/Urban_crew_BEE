import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="logo">
          <div className="logo-mark">UC</div>
          <div>
            <div>UrbanCrew</div>
            <small style={{ color: 'var(--muted)', fontWeight: 500 }}>Smart Workforce Services</small>
          </div>
        </div>
        <div>
          <p>
            UrbanCrew provides reliable manpower &amp; staffing solutions including helpers, cleaners, MTS staff, and
            support workers for schools, offices, hospitals, and societies. We manage attendance, salaries, and staff
            performance to ensure smooth operations and trusted service.
          </p>
          <p style={{ color: 'var(--yellow)', fontWeight: 600, marginTop: 6 }}>Connect with us</p>
        </div>
        <div style={{ justifySelf: 'end', textAlign: 'right' }}>
          <div className="socials">
            <a href="#contact">
              <i className="fa-solid fa-phone"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin-in" />
            </a>
          </div>
          <p style={{ marginTop: 10 }}>Copyright © UrbanCrew 2025</p>
          <p style={{ marginTop: 10 }}>Ksp Harsh</p>
        </div>
      </div>
    </footer>
  );
}

