import React from 'react';
import { motion } from 'motion/react';
import { useAppConfig } from '../../contexts/AppConfigContext';
import { ArrowLeft, FileText, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
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
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <h1 className="truncate">Terms of Service</h1>
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
              <Shield className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="space-y-2">
                <h2>Welcome to {config.appName}</h2>
                <p className="text-muted-foreground">
                  By accessing or using {config.appName}, you agree to be bound by these Terms of Service. 
                  Please read them carefully before using our platform.
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
              <h3>Acceptance of Terms</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                By registering for an account and accessing {config.appName}, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <p>
                If you do not agree to these terms, you must not access or use our services.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">2</span>
              </div>
              <h3>User Accounts</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>To use {config.appName}, you must:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Provide accurate and complete registration information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Maintain the security of your account credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Be responsible for all activities under your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Notify us immediately of any unauthorized access</span>
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
              <h3>Acceptable Use</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>You agree not to use {config.appName} to:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive shrink-0">•</span>
                  <span>Violate any applicable laws or regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive shrink-0">•</span>
                  <span>Infringe on intellectual property rights of others</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive shrink-0">•</span>
                  <span>Transmit harmful or malicious code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive shrink-0">•</span>
                  <span>Harass, abuse, or harm other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive shrink-0">•</span>
                  <span>Attempt to gain unauthorized access to our systems</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">4</span>
              </div>
              <h3>Educational Content</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                All educational materials, assignments, and content provided through {config.appName} are for 
                educational purposes only. We strive for accuracy but make no warranties about the completeness 
                or reliability of the content.
              </p>
              <p>
                Users retain ownership of their original content but grant {config.appName} a license to use, 
                display, and distribute it within the platform for educational purposes.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">5</span>
              </div>
              <h3>Privacy & Data</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by 
                our Privacy Policy. By using {config.appName}, you consent to our data practices as described 
                in the Privacy Policy.
              </p>
              <p className="text-sm italic">
                Note: This application stores data locally in your browser and does not collect or transmit 
                personal information to external servers.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">6</span>
              </div>
              <h3>Limitation of Liability</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                {config.appName} is provided "as is" without warranties of any kind. We shall not be liable 
                for any indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
              <p>
                We do not guarantee uninterrupted or error-free service and reserve the right to modify or 
                discontinue the service at any time.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">7</span>
              </div>
              <h3>Termination</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                We reserve the right to suspend or terminate your account at any time for violation of these 
                Terms of Service or for any other reason at our sole discretion.
              </p>
              <p>
                You may terminate your account at any time by discontinuing use of the service and clearing 
                your local data.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">8</span>
              </div>
              <h3>Changes to Terms</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be effective 
                immediately upon posting. Your continued use of {config.appName} after changes constitutes 
                acceptance of the modified terms.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary">9</span>
              </div>
              <h3>Contact Information</h3>
            </div>
            <div className="space-y-3 text-muted-foreground pl-10">
              <p>
                If you have any questions about these Terms of Service, please contact us through the 
                support channels available in the application.
              </p>
              <p className="text-sm">
                Email: support@{config.appName.toLowerCase().replace(/\s+/g, '')}.edu
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
