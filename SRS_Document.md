# Software Requirements Specification (SRS)
## UrbanCrew - Smart Workforce Services Platform

---

### 1. Introduction

#### 1.1 Purpose
This document specifies the software requirements for **UrbanCrew**, a web-based platform that connects verified local workforce (helpers, cleaners, MTS staff, hospital support staff) with facilities like schools, offices, hospitals, and housing societies.

#### 1.2 Scope
UrbanCrew is a single-page web application that serves as a digital presence and lead generation platform for workforce staffing services. The system facilitates:
- Service information display
- Client inquiry management
- Worker recruitment information
- Direct communication via WhatsApp integration

#### 1.3 Definitions and Acronyms
- **MTS**: Multi-Tasking Staff
- **SPA**: Single Page Application
- **UI**: User Interface
- **SRS**: Software Requirements Specification

---

### 2. Overall Description

#### 2.1 Product Perspective
UrbanCrew is a standalone web application built using modern web technologies (React, Vite) that serves as the primary digital interface for the UrbanCrew workforce management service.

#### 2.2 Product Functions
- Display comprehensive service offerings
- Showcase client benefits and testimonials
- Provide worker onboarding information
- Enable contact form submission via WhatsApp
- Responsive design for mobile and desktop access

#### 2.3 User Classes and Characteristics

**Primary Users:**
1. **Clients** (Schools, Offices, Hospitals, Housing Societies)
   - Need: Reliable workforce staffing
   - Technical Expertise: Basic web browsing
   
2. **Workers** (Helpers, Cleaners, Support Staff)
   - Need: Employment opportunities
   - Technical Expertise: Basic smartphone usage

3. **Business Administrators**
   - Need: Manage inquiries and operations
   - Technical Expertise: Moderate

---

### 3. System Features

#### 3.1 Hero Section
**Priority:** High  
**Description:** Landing section with value proposition and call-to-action buttons.

**Functional Requirements:**
- FR-3.1.1: Display company tagline and service description
- FR-3.1.2: Provide "Request Staff Now" and "Hire UrbanCrew Worker" CTAs
- FR-3.1.3: Show key highlights (verified workers, salary management, replacement guarantee)

#### 3.2 Services Display
**Priority:** High  
**Description:** Showcase all available staffing services.

**Functional Requirements:**
- FR-3.2.1: Display 7 service categories with icons and descriptions
- FR-3.2.2: Services include: Helper Staff, Cleaning & Housekeeping, MTS, Hospital Support, School Support, Society Services, Short-Term/On-Call

#### 3.3 Client Solutions Section
**Priority:** High  
**Description:** Information targeted at potential clients.

**Functional Requirements:**
- FR-3.3.1: List client types served (schools, offices, hospitals, societies, coaching institutes)
- FR-3.3.2: Display client benefits (hiring management, uniforms, monitoring, replacements)
- FR-3.3.3: Provide "Book a Meeting" CTA

#### 3.4 Worker Recruitment Section
**Priority:** High  
**Description:** Information for potential workers.

**Functional Requirements:**
- FR-3.4.1: Display worker benefits (regular salary, safe locations, job security)
- FR-3.4.2: Show onboarding steps (4-step process)
- FR-3.4.3: Provide "Join as UrbanCrew Member" button with WhatsApp integration

#### 3.5 Why Choose UrbanCrew Section
**Priority:** Medium  
**Description:** Competitive advantages and value propositions.

**Functional Requirements:**
- FR-3.5.1: Display 4 key differentiators (Verified Workers, Affordable Services, Replacement Support, Local Workforce)

#### 3.6 Testimonials Section
**Priority:** Medium  
**Description:** Client testimonials carousel.

**Functional Requirements:**
- FR-3.6.1: Display testimonials from 3 different client types
- FR-3.6.2: Auto-rotate testimonials every 5 seconds
- FR-3.6.3: Provide manual navigation dots

#### 3.7 Contact Form
**Priority:** High  
**Description:** Lead capture and inquiry submission system.

**Functional Requirements:**
- FR-3.7.1: Collect: Name, Phone, Location, Staff Required, Duration, Additional Notes
- FR-3.7.2: Validate required fields (Name, Phone, Location, Staff Required)
- FR-3.7.3: Submit form data via WhatsApp message to business number (919306512657)
- FR-3.7.4: Provide direct "Chat with UrbanCrew Team" WhatsApp link
- FR-3.7.5: Display error styling for incomplete required fields

#### 3.8 Navigation
**Priority:** High  
**Description:** Site navigation and user flow.

**Functional Requirements:**
- FR-3.8.1: Provide navigation bar with links to all sections
- FR-3.8.2: Enable smooth scrolling to sections
- FR-3.8.3: Display footer with company information

#### 3.9 Loading Experience
**Priority:** Low  
**Description:** Initial page load animation.

**Functional Requirements:**
- FR-3.9.1: Display preloader with wrench icon for 700ms on initial load

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- **UI-1:** Responsive design supporting mobile (320px+), tablet (768px+), and desktop (1024px+)
- **UI-2:** Modern aesthetic with Inter font family
- **UI-3:** Icon integration using Font Awesome and Bootstrap Icons
- **UI-4:** Consistent color scheme and branding

#### 4.2 Hardware Interfaces
- **HW-1:** Compatible with standard web browsers on desktop and mobile devices

#### 4.3 Software Interfaces
- **SW-1:** WhatsApp Web API for message submission
- **SW-2:** Google Fonts API for typography
- **SW-3:** Font Awesome and Bootstrap Icons CDN

#### 4.4 Communications Interfaces
- **COM-1:** HTTPS protocol for secure communication
- **COM-2:** WhatsApp deep linking (wa.me protocol)

---

### 5. Non-Functional Requirements

#### 5.1 Performance Requirements
- **NFR-5.1.1:** Page load time < 3 seconds on 4G connection
- **NFR-5.1.2:** Smooth animations at 60fps
- **NFR-5.1.3:** Testimonial auto-rotation every 5 seconds

#### 5.2 Security Requirements
- **NFR-5.2.1:** Client-side form validation
- **NFR-5.2.2:** No sensitive data storage in browser
- **NFR-5.2.3:** HTTPS deployment recommended

#### 5.3 Usability Requirements
- **NFR-5.3.1:** Intuitive navigation requiring no training
- **NFR-5.3.2:** Clear call-to-action buttons
- **NFR-5.3.3:** Accessible color contrast ratios
- **NFR-5.3.4:** Mobile-first responsive design

#### 5.4 Reliability Requirements
- **NFR-5.4.1:** 99.9% uptime when hosted
- **NFR-5.4.2:** Graceful degradation if external CDNs fail

#### 5.5 Maintainability Requirements
- **NFR-5.5.1:** Modular React component architecture
- **NFR-5.5.2:** Reusable ServiceCard component
- **NFR-5.5.3:** Centralized styling in index.css and App.css

---

### 6. Technical Specifications

#### 6.1 Technology Stack
- **Frontend Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.10
- **Language:** JavaScript (ES6+)
- **Styling:** Vanilla CSS
- **Icons:** Font Awesome 6.5.0, Bootstrap Icons 1.13.1
- **Fonts:** Google Fonts (Inter)

#### 6.2 Project Structure
```
Urban_Crew/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ServiceCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Cleaning.jsx
│   │   ├── HelperMTS.jsx
│   │   ├── Security.jsx
│   │   ├── HospitalStaff.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── public/
├── index.html
└── package.json
```

#### 6.3 Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

### 7. Data Requirements

#### 7.1 Contact Form Data
- **Name:** String, required, max 100 characters
- **Phone:** String (tel), required, max 15 characters
- **Location:** String, required, max 100 characters
- **Staff Required:** String, required, max 200 characters
- **Duration:** Enum (Monthly, Yearly, On-Call), default: Monthly
- **Notes:** String, optional, max 500 characters

#### 7.2 Static Content Data
- Services array (7 items)
- Client types array (5 items)
- Client benefits array (4 items)
- Worker benefits array (5 items)
- Onboarding steps array (4 items)
- Why choose us array (4 items)
- Testimonials array (3 items)
- Contact highlights array (4 items)

---

### 8. Deployment Requirements

#### 8.1 Build Process
- **Command:** `npm run build`
- **Output:** Static files in `dist/` directory
- **Optimization:** Minification, tree-shaking, code splitting

#### 8.2 Hosting Requirements
- Static file hosting (Vercel, Netlify, GitHub Pages, etc.)
- HTTPS enabled
- Custom domain support
- CDN for global distribution

---

### 9. Future Enhancements

#### 9.1 Potential Features
- Multi-language support (Hindi, English)
- Admin dashboard for inquiry management
- Worker profile database
- Client portal for staff management
- Online payment integration
- Real-time chat support
- Mobile application (iOS/Android)
- Attendance tracking system
- Performance analytics dashboard

---

### 10. Appendices

#### 10.1 Contact Information
- **WhatsApp Business Number:** +91 9306512657
- **Service Areas:** Local (city-specific deployment)

#### 10.2 Document Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | Development Team | Initial SRS Document |

---

**Document Status:** Draft  
**Prepared By:** UrbanCrew Development Team  
**Date:** February 2026
