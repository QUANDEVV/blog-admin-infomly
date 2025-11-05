
import React from "react";





export default function RootLayout({ children }) {
  // If user is logged in, render the main content
  return (
    <>

      <div className="">{children}</div>
 
    </>
  );
}