# UrbanCrew - Role-Based Dashboard System

## 🎯 Overview

UrbanCrew is a comprehensive workforce management platform with role-based dashboards for Admin, Client, and Worker users. The system enables efficient staff hiring, management, and tracking for schools, offices, hospitals, and societies.

## ✨ Features

### 🔐 Authentication System
- Email/password registration and login
- Role-based access control (Admin, Client, Worker)
- Protected routes with automatic redirects
- Session management with Firebase Auth

### 👨‍💼 Admin Dashboard
- **Overview**: Real-time statistics (clients, workers, requests, active jobs)
- **Request Management**: View and update all staff requests
- **Worker Management**: Approve/reject worker registrations
- **Client Management**: View client details and history
- **Reports & Analytics**: Service demand and utilization reports

### 🏢 Client Dashboard
- **Dashboard**: Overview of active staff and pending requests
- **Create Request**: Submit new staffing requirements
- **Request Tracking**: Monitor request status in real-time
- **Replacement Requests**: Request worker replacements
- **Profile Management**: Update organization details

### 👷 Worker Dashboard
- **Dashboard**: View current job assignment details
- **Availability Management**: Update availability status
- **Job History**: View past assignments
- **Salary Status**: Check salary payment status
- **Profile Management**: Update personal information

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 5.4.10
- **Routing**: React Router DOM 6.22.0
- **Backend**: Firebase (Authentication + Firestore)
- **Forms**: React Hook Form 7.50.0
- **Charts**: Recharts 2.12.0
- **Notifications**: React Hot Toast 2.4.1
- **Icons**: Font Awesome 6.5.0, Bootstrap Icons 1.13.1
- **Styling**: Vanilla CSS

## 📦 Installation

### Prerequisites
- Node.js 24.x or higher
- npm or yarn
- Firebase account

### Steps

1. **Clone the repository**
   ```bash
   cd Urban_Crew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Follow the instructions in `FIREBASE_SETUP.md`
   - Update `src/services/firebase.js` with your Firebase credentials

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Firebase Setup

See `FIREBASE_SETUP.md` for detailed instructions on:
- Creating a Firebase project
- Enabling Authentication
- Setting up Firestore
- Configuring security rules
- Creating the first admin user

### Environment Variables

Create a `.env` file (optional, for production):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

```
Urban_Crew/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── Modal.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ServiceCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── public/              # Public pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   └── Contact.jsx
│   │   └── dashboard/           # Protected dashboard pages
│   │       ├── admin/
│   │       │   ├── AdminDashboard.jsx
│   │       │   ├── RequestManagement.jsx
│   │       │   └── WorkerManagement.jsx
│   │       ├── client/
│   │       │   ├── ClientDashboard.jsx
│   │       │   └── CreateRequest.jsx
│   │       └── worker/
│   │           └── WorkerDashboard.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication context
│   ├── services/
│   │   └── firebase.js          # Firebase configuration
│   ├── utils/
│   │   └── constants.js         # App constants
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── FIREBASE_SETUP.md            # Firebase setup guide
├── SRS_Document.md              # Software requirements
├── package.json
└── README.md
```

## 🚀 Usage

### For Clients

1. **Register**: Click "Register" → Select "Client" → Fill organization details
2. **Wait for Approval**: Admin will activate your account
3. **Login**: Use your credentials to access the client dashboard
4. **Create Request**: Submit staffing requirements
5. **Track Requests**: Monitor status and view assigned workers

### For Workers

1. **Register**: Click "Register" → Select "Worker" → Fill your details
2. **Wait for Approval**: Admin will review and approve your registration
3. **Login**: Access your worker dashboard
4. **View Assignment**: Check your current job details
5. **Manage Availability**: Update your availability status

### For Admins

1. **Create Admin Account**: Follow Firebase setup guide
2. **Login**: Access admin dashboard
3. **Approve Workers**: Review and approve worker registrations
4. **Manage Requests**: Update request statuses and assign workers
5. **Monitor System**: View analytics and reports

## 🔒 Security

- **Authentication**: Firebase Authentication with email/password
- **Authorization**: Role-based access control (RBAC)
- **Firestore Rules**: Secure database access based on user roles
- **Route Protection**: Protected routes with automatic redirects
- **Data Validation**: Client-side and server-side validation

## 📊 Database Schema

### Collections

- **users**: User accounts with roles
- **clients**: Client organization details
- **workers**: Worker profiles and skills
- **requests**: Staff requests from clients
- **assignments**: Worker-client assignments
- **replacements**: Replacement requests

See `FIREBASE_SETUP.md` for detailed schema and security rules.

## 🎨 Customization

### Styling

- Global styles: `src/index.css`
- Component styles: `src/App.css`
- Dashboard styles: Inline styles in components

### Branding

- Update logo and colors in `src/components/Navbar.jsx`
- Modify color scheme in `src/utils/constants.js`
- Update meta tags in `index.html`

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration (Client and Worker)
- [ ] User login and logout
- [ ] Admin approval workflow
- [ ] Client request creation
- [ ] Admin request management
- [ ] Worker dashboard views
- [ ] Role-based access control
- [ ] WhatsApp integration
- [ ] Responsive design

## 📱 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Or deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

### Firebase Configuration

- Update Firebase security rules for production
- Configure Firebase hosting (optional)
- Set up custom domain

## 🐛 Troubleshooting

### Common Issues

**Issue**: Firebase configuration not found
- **Solution**: Check `src/services/firebase.js` has correct credentials

**Issue**: Users can't login after registration
- **Solution**: Check if user's `isActive` field is `true` in Firestore

**Issue**: Permission denied errors
- **Solution**: Verify Firestore security rules are correctly set

**Issue**: Routes not working
- **Solution**: Ensure React Router is properly configured in `App.jsx`

## 📝 License

This project is proprietary software for UrbanCrew.

## 👥 Support


- Email: support@urbancrew.com

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with role-based dashboards
- Firebase authentication and Firestore integration
- Admin, Client, and Worker portals
- Request management system
- Worker approval workflow

## 🚧 Roadmap

- [ ] Client management module for admin
- [ ] Reports and analytics dashboard
- [ ] Worker availability management
- [ ] Job history and salary tracking
- [ ] Replacement request workflow
- [ ] Email notifications
- [ ] Mobile responsive improvements
- [ ] Advanced search and filters
- [ ] Export functionality (CSV/PDF)
- [ ] Multi-language support

## 🤝 Contributing

This is a private project. For feature requests or bug reports, contact the development team.

---

**Built with ❤️ for UrbanCrew**
