import React from 'react';

const Contact = () => {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-4">
        We’d love to hear from you! Whether you have questions, feedback, or inquiries, feel free to reach out using the contact details below.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">General Inquiries</h2>
      <p className="text-gray-700 mb-4">
        For general questions, suggestions, or business partnerships, email us at:  
        <br />
        <a href="mailto:blogstreamos@gmail.com" className="text-blue-500 hover:underline">blogstreamos@gmail.com</a>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Technical Support</h2>
      <p className="text-gray-700 mb-4">
        Encountering issues on our website? Our technical support team is here to help:  
        <br />
        <a href="mailto:support@infomly.com" className="text-blue-500 hover:underline">support@infomly.com</a>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Advertising & Partnerships</h2>
      <p className="text-gray-700 mb-4">
        Want to advertise with us or collaborate? Reach out at:  
        <br />
        <a href="mailto:ads@infomly.com" className="text-blue-500 hover:underline">ads@infomly.com</a>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Social Media</h2>
      <p className="text-gray-700 mb-4">
        Stay connected with us:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li><a href="https://twitter.com/infomly" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a></li>
        <li><a href="https://facebook.com/infomly" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        <li><a href="https://linkedin.com/company/infomly" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Business Address</h2>
      <p className="text-gray-700 mb-4">
        Infomly HQ<br />
        123 Innovation Drive<br />
        Tech City, TX 75001, USA
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last updated: February 10, 2025
      </p>
    </div>
  );
};

export default Contact;
