
import React from "react";




// import Login from "../../components/Login"; // Import your Login component

export default function RootLayout({ children }) {
  // If user is logged in, render the main content
  return (
    <>

      <div className="">{children}</div>
 
    </>
  );
}