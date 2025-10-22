import React from 'react';

const Privacy = () => {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        At <strong>Infomly.com</strong>, we value your privacy and are committed to protecting your personal data. This privacy policy outlines how we collect, use, and safeguard your information when you interact with our website.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="text-gray-700 mb-4">
        When you visit Infomly.com, we may collect the following types of information:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Personal information you voluntarily provide (e.g., name, email address).</li>
        <li>Non-personal information, such as your IP address, browser type, and usage data, collected through cookies and analytics tools.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <p className="text-gray-700 mb-4">
        The information we collect may be used to:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Improve and personalize your experience on Infomly.com.</li>
        <li>Send newsletters or updates you subscribe to.</li>
        <li>Analyze website performance and usage trends.</li>
        <li>Respond to your inquiries and provide customer support.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Cookies and Tracking Technologies</h2>
      <p className="text-gray-700 mb-4">
        We use cookies and similar technologies to enhance your browsing experience, track website performance, and serve relevant advertisements. You can control your cookie preferences through your browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <p className="text-gray-700 mb-4">
        We may use third-party services, such as analytics providers or advertising platforms, which may collect information about your usage of Infomly.com. These third parties are governed by their own privacy policies.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p className="text-gray-700 mb-4">
        You have the right to:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Access, update, or delete your personal information.</li>
        <li>Opt out of receiving marketing communications.</li>
        <li>Request information about how your data is processed.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="text-gray-700 mb-4">
        We implement industry-standard security measures to protect your personal information. However, no method of data transmission or storage is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
      <p className="text-gray-700 mb-4">
        We may update this privacy policy periodically to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised "last updated" date.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="text-gray-700 mb-4">
        If you have any questions about this privacy policy or how we handle your information, please contact us at <a href="mailto:contact@infomly.com" className="text-blue-500 hover:underline">contact@infomly.com</a>.
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last updated: February 10, 2025
      </p>
    </div>
  );
};

export default Privacy;
