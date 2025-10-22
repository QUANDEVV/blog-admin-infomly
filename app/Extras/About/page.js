import React from 'react';

const AboutUs = () => {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      
      <p className="text-gray-700 mb-4">
        Welcome to <strong>Infomly.com</strong>, your trusted source for insightful content in News, Technology, AI, Health, and more. 
        We are dedicated to delivering accurate, engaging, and thought-provoking articles that keep you informed in an ever-evolving digital world.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
      <p className="text-gray-700 mb-4">
        At Infomly, our mission is to empower readers with reliable information and well-researched insights. We strive to bridge the gap between knowledge and curiosity by providing content that is both informative and impactful.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Vision</h2>
      <p className="text-gray-700 mb-4">
        We envision a world where information is accessible, unbiased, and engaging. Through Infomly.com, we aim to become a go-to platform for individuals seeking quality content on trending and essential topics.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Values</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li><strong>Accuracy:</strong> We prioritize factual, well-researched content.</li>
        <li><strong>Innovation:</strong> Staying ahead with the latest in technology, AI, and emerging trends.</li>
        <li><strong>Integrity:</strong> Committed to unbiased reporting and ethical journalism.</li>
        <li><strong>Engagement:</strong> Creating content that sparks discussions and drives awareness.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Why Choose Infomly?</h2>
      <p className="text-gray-700 mb-4">
        Whether you're looking for the latest tech updates, AI breakthroughs, or health trends, Infomly.com delivers content that is insightful, well-curated, and easy to understand. We go beyond news—offering in-depth analysis and expert opinions that matter.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Get in Touch</h2>
      <p className="text-gray-700 mb-4">
        Have a question, suggestion, or collaboration idea? We'd love to hear from you! Reach out to us at <a href="mailto:contact@infomly.com" className="text-blue-500 hover:underline">contact@infomly.com</a>.
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last updated: February 10, 2025
      </p>
    </div>
  );
};

export default AboutUs;
