import React from 'react';

const DoNotSellInfo = () => {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Do Not Sell My Personal Information</h1>
      <p className="text-gray-700 mb-4">
        At <strong>Infomly.com</strong>, we respect your privacy and give you control over your personal data. Under applicable privacy laws, you have the right to request that we do not sell your personal information to third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">What Does This Mean?</h2>
      <p className="text-gray-700 mb-4">
        We may share certain data with advertisers or partners to enhance your experience. By opting out, we will ensure that your personal data is not shared for targeted advertising purposes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How to Opt Out</h2>
      <p className="text-gray-700 mb-4">
        If you would like to opt out of the sale of your personal data, please submit a request through one of the following methods:
      </p>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Fill out our <a href="/opt-out-form" className="text-blue-500 hover:underline">Opt-Out Form</a></li>
        <li>Email us at <a href="mailto:privacy@infomly.com" className="text-blue-500 hover:underline">privacy@infomly.com</a></li>
        <li>Call our Privacy Support at +1-800-123-4567</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Your Privacy Rights</h2>
      <p className="text-gray-700 mb-4">
        In addition to opting out, you have the right to request access to, correct, or delete your personal data. For more details, please visit our <a href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</a>.
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last updated: February 10, 2025
      </p>
    </div>
  );
};

export default DoNotSellInfo;
