import React from 'react';
import { motion } from 'motion/react';
import { useAppConfig } from '../../contexts/AppConfigContext';
import { ArrowLeft, Shield, Lock, Eye, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const { config } = useAppConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 safe-area-top safe-area-bottom">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border"
        >
          <div className="flex items-center gap-3 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <h1 className="truncate">Privacy Policy</h1>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 sm:p-6 space-y-6"
        >
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Last updated: October 5, 2025</span>
          </div>

          {/* Introduction */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="space-y-2">
                <h2>Your Privacy Matters</h2>
                <p className="text-muted-foreground">
                  At {config.appName}, we are committed to protecting your privacy. This Privacy Policy explains 
                  how we collect, use, and safeguard your information when you use our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-primary">Local Storage Notice</h3>
                <p className="text-sm text-muted-foreground">
                  {config.appName} is a frontend-only application that stores all data locally in your browser. 
                  We do not collect, transmit, or store your personal information on external servers.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">1</span>
              </div>
              <h3>Information We Collect</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>When you use {config.appName}, we may collect the following information:</p>
              <div className="space-y-3">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="text-foreground mb-2">Account Information</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Name and email address</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>User role (Student, Teacher, or Admin)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Profile information and preferences</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="text-foreground mb-2">Educational Data</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Class enrollments and assignments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Grades and attendance records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Announcements and communications</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="text-foreground mb-2">Usage Data</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>App preferences and settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Theme and customization choices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">2</span>
              </div>
              <h3>How We Use Your Information</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>We use the information we collect to:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Provide and maintain our educational services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Personalize your learning experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Track academic progress and attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Facilitate communication between students, teachers, and administrators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Improve and optimize our platform</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">3</span>
              </div>
              <h3>Data Storage & Security</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                {config.appName} stores all user data locally in your browser using localStorage. This means:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Your data never leaves your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>We do not have access to your personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Data is tied to your specific browser and device</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Clearing browser data will remove all stored information</span>
                </li>
              </ul>
              <p className="text-sm italic pt-2">
                Note: Because data is stored locally, you are responsible for backing up any important information.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">4</span>
              </div>
              <h3>Data Sharing</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                Since {config.appName} is a frontend-only application with local storage, we do not share your 
                data with third parties. Your information remains on your device.
              </p>
              <p>
                Within the app, certain information may be visible to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Teachers can view student grades, attendance, and assignments in their classes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Administrators can view all classroom and user management data</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Students can only view their own academic information</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">5</span>
              </div>
              <h3>Your Rights</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>You have the right to:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Access and view all your stored data within the app</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Update or correct your personal information at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Delete your account and all associated data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Export your data from the app settings</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">6</span>
              </div>
              <h3>Children's Privacy</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                {config.appName} may be used by students of various ages. We are committed to protecting the 
                privacy of all users, including minors. Parents and guardians should supervise their children's 
                use of the platform.
              </p>
              <p>
                For users under 13, we recommend that parents or guardians review this Privacy Policy and 
                assist with account creation and management.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">7</span>
              </div>
              <h3>Cookies & Tracking</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                {config.appName} does not use cookies or tracking technologies. All preferences and settings 
                are stored locally in your browser's localStorage.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">8</span>
              </div>
              <h3>Changes to Privacy Policy</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                with an updated revision date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">9</span>
              </div>
              <h3>Contact Us</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, 
                please contact us through the support channels available in the application.
              </p>
              <p className="text-sm">
                Email: privacy@{config.appName.toLowerCase().replace(/\s+/g, '')}.edu
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-4">
            <Button
              onClick={onBack}
              className="w-full"
              size="lg"
            >
              Back to Login
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pb-4">
            <p>© 2025 {config.appName}. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
