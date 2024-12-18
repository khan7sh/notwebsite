import React from 'react';
import BackButton from './BackButton';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-4xl font-bold text-burgundy mb-8">Privacy Policy</h1>
        <div className="prose prose-burgundy">
          <p>Last updated: 02.11.2024</p>
          <p>At Noshe Cambridge, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services.</p>
          
          <h2>Cookie Policy</h2>
          <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
          
          <h3>Types of Cookies We Use:</h3>
          <ul>
            <li>Essential cookies: Required for the website to function properly</li>
            <li>Analytics cookies: Help us understand how visitors interact with our website</li>
            <li>Functional cookies: Enable enhanced functionality and personalization</li>
          </ul>
          
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</p>
          
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you make a reservation, sign up for our newsletter, or contact us. This may include your name, email address, phone number, and any other information you choose to provide.</p>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process your reservations, to communicate with you, and to send you marketing communications (if you've opted in).</p>
          
          <h2>Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
          
          <h2>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data.</p>
          
          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at [noshecambridge@gmail.com].</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;