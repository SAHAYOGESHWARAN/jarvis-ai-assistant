import React from 'react';

// A simple mock for routing, replace with actual React Router NavLink later
const MockNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <a href={to} className="block py-2 px-4 rounded hover:bg-gray-700">
    {children}
  </a>
);

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4 space-y-2 h-full">
      <MockNavLink to="/dashboard">Dashboard</MockNavLink>
      <MockNavLink to="/chat">Chat</MockNavLink>
      <MockNavLink to="/security">Home Security</MockNavLink>
      <MockNavLink to="/reminders">Reminders</MockNavLink>
      <MockNavLink to="/notes">Notepad</MockNavLink>
      <MockNavLink to="/settings">Settings</MockNavLink>
      <hr className="my-2 border-gray-700" />
      <MockNavLink to="/admin">Admin Dashboard</MockNavLink>
    </aside>
  );
};

export default Sidebar;
