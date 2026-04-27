import React, { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard.jsx';

const services = [
  { title: 'Helper Staff', description: 'Pantry helpers, office boys, lift operators.', icon: 'fa-people-carry-box' },
  { title: 'Cleaning & Housekeeping', description: 'Sweepers, janitorial staff keeping spaces spotless.', icon: 'fa-broom' },
  { title: 'MTS (Multi-Tasking Staff)', description: 'Document handling, office support, errands.', icon: 'fa-clipboard-list' },
  { title: 'Hospital Support Staff', description: 'Ward boys, maintenance assistants, support teams.', icon: 'fa-stethoscope' },
  { title: 'School Support Staff', description: 'Lab helpers, ground workers, class helpers.', icon: 'fa-school' },
  { title: 'Society Services', description: 'Maintenance helpers, cleaners for housing societies.', icon: 'fa-building-user' },
  { title: 'Short-Term / On-Call', description: 'Event helpers, movers, backup teams on demand.', icon: 'fa-clock-rotate-left' },
];

const clientsServed = [
  { label: 'Private & Government Schools', icon: 'fa-school-flag' },
  { label: 'Offices and Corporate Buildings', icon: 'fa-briefcase' },
  { label: 'Hospitals & Clinics', icon: 'fa-hospital' },
  { label: 'Housing Societies', icon: 'fa-house-user' },
  { label: 'Coaching Institutes', icon: 'fa-graduation-cap' },
];

const clientBenefits = [
  { label: 'UrbanCrew handles hiring, attendance, salaries', icon: 'fa-id-badge' },
  { label: 'Workers in proper uniform & ID', icon: 'fa-shirt' },
  { label: 'Regular monitoring & performance reporting', icon: 'fa-chart-line' },
  { label: 'Fast replacement in emergencies', icon: 'fa-person-walking-luggage' },
];

const workerBenefits = [
  { label: 'Regular monthly salary', icon: 'fa-indian-rupee-sign' },
  { label: 'Safe working locations', icon: 'fa-shield-halved' },
  { label: 'No need to negotiate with clients', icon: 'fa-handshake' },
  { label: 'If one job ends — new work arranged', icon: 'fa-arrows-rotate' },
  { label: 'Work ID card + UrbanCrew T-shirt provided', icon: 'fa-id-card' },
];

const onboardingSteps = ['Submit name + ID proof', 'Quick skill check', 'Orientation + uniform', 'Work assignment'];

const whyUs = [
  { title: 'Verified Workers', description: 'Government ID checks and onboarding by UrbanCrew.', icon: 'fa-user-shield' },
  { title: 'Affordable Services', description: 'Transparent pricing, no hidden surprises.', icon: 'fa-scale-balanced' },
  { title: 'Replacement Support', description: 'Never stay short-staffed with quick swap-outs.', icon: 'fa-arrow-rotate-left' },
  { title: 'Local Workforce', description: 'Supporting community employment and faster response.', icon: 'fa-location-dot' },
];

const testimonials = [
  {
    quote: 'UrbanCrew’s cleaners are punctual and consistent. Our campus stays spotless without chasing anyone.',
    name: 'Principal, City School',
  },
  {
    quote: 'We get quick replacements during events. Their support manager is always available.',
    name: 'Admin Head, Corporate Office',
  },
  {
    quote: 'Ward boys were trained and uniformed from day one. Smooth onboarding.',
    name: 'Operations, Sunrise Hospital',
  },
];

const contactHighlights = [
  { label: 'Response within 1 business hour', icon: 'fa-clock' },
  { label: 'Local teams with area familiarity', icon: 'fa-location-dot' },
  { label: 'Dedicated manager for every account', icon: 'fa-user-tie' },
  { label: '24/7 customer support', icon: 'fa-headset' },
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <main id="top">
      <section className="hero" id="hero">
        <div className="container hero-content">
          <span className="pill">
            <i className="fa-solid fa-location-dot" /> Local, Verified Workforce
          </span>
          <h1>Trusted Local Workforce for Schools, Offices &amp; Hospitals</h1>
          <p style={{ fontSize: 18 }}>Reliable Helpers, Cleaners &amp; MTS Staff at Your Service.</p>
          <div className="cta-group">
            <a className="btn" href="#contact">
              Request Staff Now
            </a>
            <a className="btn secondary" href="#services">
              Hire UrbanCrew Worker
            </a>
          </div>
          <div className="highlights">
            <div className="chip">
              <i className="fa-solid fa-user-shield" /> Verified Local Workers
            </div>
            <div className="chip">
              <i className="fa-solid fa-id-card-clip" /> Salary &amp; Management by UrbanCrew
            </div>
            <div className="chip">
              <i className="fa-solid fa-rotate" /> Instant Replacement Guarantee
            </div>
            <div className="chip">
              <i className="fa-solid fa-user-check" /> Dedicated Support Manager
            </div>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="container">
          <div className="section-header">
            <p className="pill" style={{ marginBottom: 12 }}>
              🧹 Our Services
            </p>
            <h2>Staffing for every facility need</h2>
            <p>From daily upkeep to specialized support, UrbanCrew delivers reliable on-ground teams.</p>
          </div>
          <div className="cards">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section id="clients">
        <div className="container">
          <div className="section-header">
            <p className="pill" style={{ marginBottom: 12 }}>
              🏢 Client Solutions
            </p>
            <h2>Built for facilities that run non-stop</h2>
            <p>UrbanCrew takes care of hiring, attendance, salaries, uniforms, and rapid replacements.</p>
          </div>
          <div className="grid-two">
            <div className="banner">
              <h3 style={{ margin: '0 0 10px' }}>We serve</h3>
              <ul className="list">
                {clientsServed.map((item) => (
                  <li key={item.label}>
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="banner" style={{ borderStyle: 'solid' }}>
              <h3 style={{ margin: '0 0 10px' }}>Benefits for you</h3>
              <ul className="list">
                {clientBenefits.map((item) => (
                  <li key={item.label}>
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 12 }}>
                <a className="btn" href="#contact">
                  <i className="fa-solid fa-calendar-check" /> Book a Meeting
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workers">
        <div className="container">
          <div className="section-header">
            <p className="pill" style={{ marginBottom: 12 }}>
              👷‍♂️ For Workers
            </p>
            <h2>Join UrbanCrew &amp; Get Regular Work</h2>
            <p>Earn a steady income, work safely, and let us handle the client coordination.</p>
          </div>
          <div className="grid-two">
            <div className="banner">
              <h3 style={{ margin: '0 0 10px' }}>Benefits for workers</h3>
              <ul className="list">
                {workerBenefits.map((item) => (
                  <li key={item.label}>
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Onboarding steps</h3>
              <div className="steps">
                {onboardingSteps.map((step) => (
                  <div className="step" key={step}>
                    {step}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <a
                  className="btn secondary"
                  href="/register"
                >
                  <i className="fa-solid fa-user-plus"></i> Join as UrbanCrew Member
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why">
        <div className="container">
          <div className="section-header">
            <p className="pill" style={{ marginBottom: 12 }}>
              🛡 Why Choose UrbanCrew
            </p>
            <h2>Operational peace of mind</h2>
            <p>Reliable staff, clear pricing, and a dedicated manager ensuring every shift runs smoothly.</p>
          </div>
          <div className="why-grid">
            {whyUs.map((item) => (
              <div className="card" key={item.title}>
                <div className="icon">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="container">
          <div className="section-header">
            <p className="pill" style={{ marginBottom: 12 }}>
              ⭐ Testimonials
            </p>
            <h2>Trusted by schools, offices, and hospitals</h2>
            <p>Hear from teams who rely on UrbanCrew to keep operations running smoothly.</p>
          </div>
          <div className="cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {testimonials.map((item, idx) => (
              <div className="testimonial" key={item.name} style={{ display: idx === currentTestimonial ? 'grid' : 'none' }}>
                <i className="fa-solid fa-quote-left" style={{ color: 'var(--yellow)', fontSize: 20 }} />
                <p>“{item.quote}”</p>
                <strong style={{ color: 'var(--yellow)' }}>{item.name}</strong>
              </div>
            ))}
          </div>
          <div className="dots">
            {testimonials.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(idx)}
              />
            ))}
          </div>
        </div>
      </section>
<section id="contact">
  <div className="container">
    <div className="section-header">
      <p className="pill" style={{ marginBottom: 12 }}>
        📞 Contact Us
      </p>
      <h2>Tell us what you need</h2>
      <p>Share your staffing requirements and we will assign a support manager.</p>
    </div>

    <div className="grid-two">
      {/* UPDATED FORM WITH WHATSAPP SUBMIT */}
      <form
  className="contact-form"
  onSubmit={(e) => {
    e.preventDefault();

    const nameEl = document.getElementById("name");
    const phoneEl = document.getElementById("phone");
    const locationEl = document.getElementById("location");
    const staffEl = document.getElementById("staff");
    const durationEl = document.getElementById("duration");
    const notesEl = document.getElementById("notes");

    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const location = locationEl.value.trim();
    const staff = staffEl.value.trim();
    const duration = durationEl.value;
    const notes = notesEl.value.trim();

    // Reset previous error styles
    [nameEl, phoneEl, locationEl, staffEl].forEach(el => {
      el.style.border = "1px solid #ddd";
    });

    // Validate required fields
    let hasError = false;
    if (!name) {
      nameEl.style.border = "2px solid red";
      hasError = true;
    }
    if (!phone) {
      phoneEl.style.border = "2px solid red";
      hasError = true;
    }
    if (!location) {
      locationEl.style.border = "2px solid red";
      hasError = true;
    }
    if (!staff) {
      staffEl.style.border = "2px solid red";
      hasError = true;
    }

    if (hasError) {
      alert("⚠️ Please fill all required fields before submitting.");
      return; // STOP SUBMIT
    }

    // Create WhatsApp Message
    const message =
      `*Hello UrbanCrew Team%20!*%0A%0A` +
      `Requesting Staffing Support:%0A` +
      `--------------------------------%0A` +
      ` Name: ${name}%0A` +
      ` Phone: ${phone}%0A` +
      ` Location: ${location}%0A` +
      ` Staff Required: ${staff}%0A` +
      ` Duration: ${duration}%0A` +
      ` Notes: ${notes || "N/A"}%0A%0A` +
      `Please assign a support manager.`;

    const whatsappURL = `https://wa.me/919306512657?text=${message}`;
    window.open(whatsappURL, "_blank");
  }}
>

        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Enter your name" />
        </div>

        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" placeholder="Enter phone number" />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" type="text" placeholder="City / Area" />
        </div>

        <div className="field">
          <label htmlFor="staff">Staff Required (type + count)</label>
          <input id="staff" name="staff" type="text" placeholder="e.g., 4 cleaners, 2 helpers" />
        </div>

        <div className="field">
          <label htmlFor="duration">Duration</label>
          <select id="duration" name="duration" defaultValue="Monthly">
            <option>Monthly</option>
            <option>Yearly</option>
            <option>On-Call</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="notes">Additional notes</label>
          <textarea id="notes" name="notes" placeholder="Share schedule, shifts, or any detail" />
        </div>

        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button className="btn" type="submit">
            <i className="fa-solid fa-paper-plane" /> Submit Request
          </button>

          <a
            className="btn secondary"
            href="https://wa.me/919306512657?text=Hello%20UrbanCrew%20Team%20!"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-whatsapp"></i> Chat with UrbanCrew Team
          </a>
        </div>
      </form>

      {/* INFORMATIVE SIDE */}
      <div className="banner">
        <h3 style={{ margin: "0 0 10px" }}>Quick info</h3>
        <ul className="list">
          {contactHighlights.map((item) => (
            <li key={item.label}>
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}

