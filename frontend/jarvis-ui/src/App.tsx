import React from 'react';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import ChatInterface from './components/ChatInterface/ChatInterface';
// import Dashboard from './components/Dashboard/Dashboard';
// import Settings from './components/Settings/Settings';

function App() {
  // Basic state to simulate page navigation for now
  // In a real app, this would be handled by React Router
  const [currentPage, setCurrentPage] = React.useState('chat');

  let content;
  switch (currentPage) {
    case 'chat':
      content = <ChatInterface />;
      break;
    // case 'dashboard':
    //   content = <Dashboard />;
    //   break;
    // case 'settings':
    //   content = <Settings />;
    //   break;
    default:
      content = <ChatInterface />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {content}
          {/* Placeholder for page content based on routing */}
          {/* For now, just showing ChatInterface */}
          {/* <ChatInterface /> */}
          {/* Or <Dashboard /> */}
          {/* Or <Settings /> */}
        </main>
      </div>
    </div>
  );
}

export default App;
