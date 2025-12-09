import React from 'react';

const Loading = () => {
  return (
    <div className='min-h-screen flex flex items-center justify-center'>
     <div className='w-16 sm:w-20 aspect-square border-4 
     border-gray-300 border-t-4 border-t-blue rounded-full animate-spin'>
     </div>
    </div>
  );
};

export default Loading;