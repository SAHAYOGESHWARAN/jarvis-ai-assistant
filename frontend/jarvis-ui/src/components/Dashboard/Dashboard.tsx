import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example Widget 1 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">System Status</h2>
          <p className="text-green-500">All systems normal.</p>
        </div>
        {/* Example Widget 2 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
          <p>Call mom at 6 PM.</p>
        </div>
        {/* Example Widget 3 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Weather</h2>
          <p>Sunny, 25°C.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
