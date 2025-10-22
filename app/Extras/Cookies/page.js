import React from 'react';

const Cookies = () => {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Cookies Policy</h1>

      <p className="text-gray-700 mb-4">
        At <strong>Infomly.com</strong>, we use cookies and similar technologies to enhance your browsing experience, analyze site performance, and provide personalized content. This Cookies Policy explains what cookies are, how we use them, and your options for managing them.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">What Are Cookies?</h2>
      <p className="text-gray-700 mb-4">
        Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, track site performance, and enhance user experience.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Types of Cookies We Use</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li><strong>Essential Cookies:</strong> Required for core website functionality, such as security and accessibility.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site to improve content and navigation.</li>
        <li><strong>Advertising Cookies:</strong> Enable us to serve relevant ads and measure their effectiveness.</li>
        <li><strong>Preference Cookies:</strong> Store your settings and preferences for a personalized experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How We Use Cookies</h2>
      <p className="text-gray-700 mb-4">
        We use cookies to:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Improve website functionality and user experience.</li>
        <li>Analyze traffic and visitor behavior to optimize content.</li>
        <li>Display personalized advertisements based on your interests.</li>
        <li>Remember your preferences and login details.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Managing Your Cookie Preferences</h2>
      <p className="text-gray-700 mb-4">
        You can control or disable cookies through your browser settings. However, disabling certain cookies may affect the functionality of Infomly.com. Below are links to manage cookies in popular browsers:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Internet Explorer / Edge</a></li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Cookies</h2>
      <p className="text-gray-700 mb-4">
        Some cookies are set by third-party services, such as analytics providers and advertisers. These cookies are governed by their respective privacy policies. We recommend reviewing their policies for more details.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
      <p className="text-gray-700 mb-4">
        We may update this Cookies Policy from time to time to reflect changes in regulations or our cookie practices. Any updates will be posted on this page.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="text-gray-700 mb-4">
        If you have any questions regarding our use of cookies, please contact us at <a href="mailto:contact@infomly.com" className="text-blue-500 hover:underline">contact@infomly.com</a>.
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last updated: February 10, 2025
      </p>
    </div>
  );
};

export default Cookies;
