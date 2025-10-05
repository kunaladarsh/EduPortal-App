# 🎯 Feature Configuration System

## Overview
This application now includes a comprehensive feature configuration system that allows you to enable/disable features for different user roles. 

## Current Configuration

### 🔴 **Teacher Role - DISABLED Features**
As requested, the following features are **DISABLED** for teachers:
- ❌ **Assignments** - Teachers cannot access assignment management
- ❌ **Messages** - Teachers cannot access messaging system  
- ❌ **Documents** - Teachers cannot access document management

### ✅ **Teacher Role - ENABLED Features**
Teachers have access to:
- ✅ Dashboard
- ✅ Profile
- ✅ Settings  
- ✅ Notifications
- ✅ Grades
- ✅ Attendance
- ✅ Calendar
- ✅ Announcements
- ✅ Library
- ✅ Reports

### 👑 **Admin Role - All Features Enabled**
Administrators have access to all features including:
- ✅ All core features
- ✅ Feature Management interface
- ✅ Class Management
- ✅ All communication tools

### 🎓 **Student Role - Standard Features**
Students have access to:
- ✅ Dashboard, Profile, Settings, Notifications
- ✅ Assignments (view/submit)
- ✅ Grades (view only)
- ✅ Attendance (view only)
- ✅ Calendar, Announcements, Library
- ✅ Messages
- ❌ Documents (disabled by default)

## How to Modify Configuration

### Method 1: Code Configuration (Permanent)
Edit `/config/features.ts` file:

```typescript
// In ROLE_FEATURE_CONFIG object:
teacher: {
  assignments: { enabled: false }, // Disable assignments
  messages: { enabled: false },    // Disable messages
  documents: { enabled: false },   // Disable documents
  // ... other features
}
```

### Method 2: Admin Interface (Runtime)
1. Login as an administrator
2. Go to **Settings** → **Feature Management** (or use mobile nav)
3. Select user role and toggle features on/off
4. Save changes

### Method 3: User Settings (Personal)
Users can toggle non-core features:
1. Go to **Settings** → **Features**
2. Toggle available features for your account
3. Core features (Dashboard, Profile, Settings) cannot be disabled

## Navigation Impact

### Bottom Navigation (Mobile)
- **Teacher**: Shows Dashboard, Grades, Attendance, Calendar, Library
- **Admin**: Shows Dashboard, Classes, Library, Messages, Documents  
- **Student**: Shows Dashboard, Assignments, Library, Messages, Profile

### Mobile Drawer Navigation
- Automatically filters based on enabled features
- Disabled features don't appear in navigation
- Admin gets additional "Feature Management" option

### Page Access Control
- Disabled features show "Feature not available" message
- Access control respects both global feature flags and role permissions
- Routes are protected at the component level

## Key Features of the System

1. **Role-Based Access**: Different permissions for admin, teacher, student
2. **Runtime Configuration**: Admin can change settings without code changes
3. **Graceful Degradation**: Disabled features are hidden from navigation
4. **Core Feature Protection**: Essential features (Dashboard, Profile, Settings) cannot be disabled
5. **Export/Import**: Configuration can be exported as JSON
6. **Beta Feature Support**: Special handling for experimental features

## Files Added/Modified

### New Files:
- `/config/features.ts` - Main feature configuration
- `/contexts/FeatureContext.tsx` - React context for feature management
- `/components/admin/FeatureManagement.tsx` - Admin interface
- `/components/settings/FeatureToggle.tsx` - User feature settings

### Modified Files:
- `/App.tsx` - Added feature provider and access control
- `/components/navigation/TopBar.tsx` - Feature-aware navigation
- `/components/navigation/MobileNav.tsx` - Dynamic navigation based on features
- `/components/settings/SettingsPage.tsx` - Added feature toggle section

## Usage Examples

### Check if feature is enabled:
```typescript
const { isFeatureEnabled } = useFeatures();
if (isFeatureEnabled('assignments')) {
  // Show assignments feature
}
```

### Get enabled features for navigation:
```typescript
const { getNavigationFeatures } = useFeatures();
const navItems = getNavigationFeatures();
```

### Toggle feature (admin only):
```typescript
const { toggleFeature } = useFeatures();
toggleFeature('assignments', 'teacher');
```

## Current State
✅ **Ready to use** - Teachers logging in will see assignments, documents, and messages are disabled as requested. Admin can modify these settings through the Feature Management interface.