import React from 'react'
import CreatePostForm from './Components/CreatePostForm'  // Import the new form component (added for modularity within workspace)

const page = () => {
  return (
    <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64 font-sans mt-10">
      {/* Import components needed only for creating posts here */}
      {/* import from this components folder in CreatePosts */}
      <CreatePostForm />  {/* Added form component to handle article creation (references store API) */}
    </div>
  )
}

export default page