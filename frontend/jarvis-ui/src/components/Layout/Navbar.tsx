import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Jarvis AI</div>
        <div>
          {/* Navigation Links could go here if needed */}
          <span className="mr-4">User Name</span>
          <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
