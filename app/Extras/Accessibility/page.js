import React from 'react';

const AccessibilityHelp = () => {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Accessibility Help</h1>

      <p className="text-gray-700 mb-4">
        At <strong>Infomly.com</strong>, we are committed to making our website accessible to everyone, including people with disabilities. Our goal is to provide an inclusive digital experience by following web accessibility best practices and standards.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Accessibility Features</h2>
      <p className="text-gray-700 mb-4">
        We have implemented the following features to improve accessibility:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li><strong>Keyboard Navigation:</strong> Our website is fully navigable using only a keyboard.</li>
        <li><strong>Alternative Text:</strong> Images include descriptive alt text for screen readers.</li>
        <li><strong>Readable Fonts:</strong> We use easy-to-read fonts with adjustable sizes.</li>
        <li><strong>Contrast and Color:</strong> Our color scheme ensures sufficient contrast for better readability.</li>
        <li><strong>Screen Reader Compatibility:</strong> Infomly.com is optimized for screen readers.</li>
        <li><strong>Captions & Transcripts:</strong> Video content includes captions and transcripts where possible.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How to Adjust Accessibility Settings</h2>
      <p className="text-gray-700 mb-4">
        Here are some ways to customize your experience for better accessibility:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li><strong>Zoom In/Out:</strong> Use <code>Ctrl</code> + <code>+</code> or <code>Ctrl</code> + <code>-</code> (Windows) and <code>Cmd</code> + <code>+</code> or <code>Cmd</code> + <code>-</code> (Mac) to adjust text size.</li>
        <li><strong>Enable High Contrast Mode:</strong> Adjust contrast settings in your operating system for better visibility.</li>
        <li><strong>Use Screen Readers:</strong> Popular screen readers like <a href="https://www.nvaccess.org/download/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">NVDA</a> (Windows) and <a href="https://support.apple.com/guide/voiceover/welcome/mac" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VoiceOver</a> (Mac) help navigate the site.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Need Assistance?</h2>
      <p className="text-gray-700 mb-4">
        If you encounter any accessibility barriers while using Infomly.com, please reach out to us. We continuously strive to improve accessibility and appreciate your feedback.
      </p>
      <p className="text-gray-700 mb-4">
        Contact us at <a href="mailto:accessibility@infomly.com" className="text-blue-500 hover:underline">accessibility@infomly.com</a> for assistance.
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last updated: February 10, 2025
        Last updated: February 10, 2025

      </p>
    </div>
  );
};

export default AccessibilityHelp;
