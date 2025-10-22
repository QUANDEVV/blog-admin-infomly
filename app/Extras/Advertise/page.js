import React from 'react';

const AdvertiseWithUs = () => {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Advertise With Us</h1>
      <p className="text-gray-700 mb-4">
        Reach a highly engaged audience with Infomly.com. Our platform offers premium advertising opportunities for brands looking to connect with readers interested in technology, AI, business, health, and more.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Why Advertise With Us?</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li><strong>Targeted Audience:</strong> Our readers are tech-savvy, business professionals, and decision-makers.</li>
        <li><strong>High Visibility:</strong> Get your brand in front of thousands of daily visitors.</li>
        <li><strong>Custom Campaigns:</strong> Choose from banner ads, sponsored content, newsletter placements, and more.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Advertising Options</h2>
      <p className="text-gray-700 mb-4">
        We offer various advertising formats tailored to your brand’s needs:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Banner Ads (Header, Sidebar, Inline)</li>
        <li>Sponsored Articles & Product Reviews</li>
        <li>Newsletter Sponsorships</li>
        <li>Social Media Promotions</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Get Started</h2>
      <p className="text-gray-700 mb-4">
        Contact us to explore advertising opportunities that fit your goals.
        <br />
        Email: <a href="mailto:advertise@infomly.com" className="text-blue-500 hover:underline">advertise@infomly.com</a>
        <br />
        Phone: +1-800-123-7890
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last updated: February 10, 2025
      </p>
    </div>
  );
};

export default AdvertiseWithUs;
