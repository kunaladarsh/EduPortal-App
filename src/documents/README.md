# 🎓 EduManage - Professional School Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06B6D4.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg)

**A production-ready, mobile-first classroom and school management system**

[Features](#features) • [Installation](#installation) • [Documentation](#documentation) • [Demo](#demo)

</div>

---

## ✨ Key Features

### 🎯 Production Ready
- ✅ Secure authentication & authorization
- ✅ Role-based access control (Admin, Teacher, Student)
- ✅ PWA with offline support
- ✅ Mobile-first responsive design
- ✅ Production-optimized build
- ✅ Ready for backend integration

### 📱 Mobile-First Excellence
- Beautiful glassmorphic UI design
- Optimized for modern mobile devices
- Touch-friendly interactions
- Smooth animations and transitions
- Safe area support for notched devices
- Install-to-home-screen capability

### 🎨 Theming & Customization
- 20+ beautiful color combinations
- Full light/dark mode support
- Dynamic theme switching
- White-label ready
- Custom branding support
- Accessibility-focused design

### 🛠️ Core Modules

| Module | Features |
|--------|----------|
| **Dashboard** | Role-specific dashboards, Quick actions, Real-time statistics |
| **Classes** | Create & manage classes, Student enrollment, Class schedules |
| **Attendance** | Quick mark attendance, Analytics & reports, History tracking |
| **Assignments** | Create & submit assignments, Auto-grading, Submission tracking |
| **Grades** | Comprehensive grade management, GPA calculation, Progress reports |
| **Calendar** | Event management, Class schedules, Reminders |
| **Messaging** | In-app messaging, Announcements, Notifications |
| **Reports** | Detailed analytics, Export capabilities, Visual charts |

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd edumanage

# Install dependencies
npm install

# Start development server
npm run dev
```

### First Login

1. Visit `http://localhost:5173`
2. Click "Sign Up" to create your account
3. Choose your role (Admin, Teacher, or Student)
4. Complete registration and start using the app

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Documentation

- **[Production Guide](PRODUCTION_READY.md)** - Complete production deployment guide
- **[Features Guide](README-Features.md)** - Detailed feature documentation
- **[Theme System](HOW_TO_USE_DARK_MODE.md)** - Theming and customization
- **[Mobile Guide](README-Mobile-Home.md)** - Mobile-specific features
- **[Backend Integration](PRODUCTION_READY.md#backend-integration)** - API integration guide

## 🏗️ Tech Stack

### Frontend
- **React 18+** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.0** - Styling
- **Motion** - Animations
- **Lucide Icons** - Icon system

### Features
- **PWA** - Progressive Web App capabilities
- **Offline Support** - Service worker integration
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 AA compliant

## 📁 Project Structure

```
edumanage/
├── components/          # React components
│   ├── auth/           # Authentication
│   ├── dashboard/      # Dashboard components
│   ├── classes/        # Class management
│   ├── attendance/     # Attendance tracking
│   ├── assignments/    # Assignment system
│   ├── grades/         # Grade management
│   └── ...
├── contexts/           # React contexts
├── services/           # Business logic
├── hooks/              # Custom hooks
├── types/              # TypeScript types
├── utils/              # Utility functions
└── public/             # Static assets
```

## 🎨 Customization

### App Configuration

Update in `/contexts/AppConfigContext.tsx`:

```typescript
const config = {
  appName: "Your School Name",
  logoUrl: "/your-logo.png",
  primaryColor: "#3B82F6",
  supportEmail: "support@yourschool.com"
};
```

### Feature Management

Configure features in `/config/features.ts`:

```typescript
export const features = {
  attendance: { enabled: true, roles: ['admin', 'teacher', 'student'] },
  grades: { enabled: true, roles: ['admin', 'teacher', 'student'] },
  // ... configure based on your needs
};
```

### Theme Customization

Add custom themes in `/constants/theme.ts` or use the built-in 20+ themes.

## 🔐 Security

### Current (Frontend-Only)
- Local authentication with localStorage
- Password validation
- Role-based access control
- Secure session management

### Production Recommendations
- Integrate with backend authentication
- Use JWT tokens
- Implement HTTPS
- Add rate limiting
- Enable CORS properly
- Sanitize user inputs

## 📱 PWA Features

- ✅ Offline functionality
- ✅ Install to home screen
- ✅ App shortcuts
- ✅ Background sync ready
- ✅ Push notifications ready
- ✅ Responsive across all devices

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚢 Deployment

### Recommended Platforms

1. **Vercel** (Easiest)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Static Hosting**
   - Upload `dist` folder to any static host
   - Configure for SPA routing

See [Production Guide](PRODUCTION_READY.md) for detailed deployment instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React best practices
- Inspired by leading education platforms
- Community-driven feature development

## 📞 Support

- 📧 Email: support@edumanage.com
- 💬 Discord: [Join our community](#)
- 📚 Documentation: [Full Docs](PRODUCTION_READY.md)
- 🐛 Issues: [GitHub Issues](#)

## 🗺️ Roadmap

### Completed ✅
- [x] User authentication
- [x] Role-based dashboards
- [x] Class management
- [x] Attendance system
- [x] Assignment system
- [x] Grade management
- [x] Calendar & events
- [x] Theme system
- [x] PWA support
- [x] Accessibility features

### Coming Soon 🚀
- [ ] Backend API integration
- [ ] Video conferencing
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics
- [ ] Parent portal
- [ ] Biometric attendance
- [ ] AI-powered insights
- [ ] Integration marketplace

---

<div align="center">

**Made with ❤️ for Education**

[⬆ Back to Top](#-edumanage---professional-school-management-system)

</div>