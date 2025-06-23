import React from 'react';

const ChatInterface: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chat Interface</h1>
      {/* Chat messages and input will go here */}
      <div className="mt-4 p-4 border rounded-lg h-96 overflow-y-auto bg-gray-50">
        {/* Example Message */}
        <div className="mb-2">
          <p className="bg-blue-500 text-white p-2 rounded-lg inline-block">Hello Jarvis!</p>
        </div>
        <div className="mb-2 text-right">
          <p className="bg-gray-300 text-black p-2 rounded-lg inline-block">Hello! How can I help you today?</p>
        </div>
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          placeholder="Type your message..."
        />
        <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
