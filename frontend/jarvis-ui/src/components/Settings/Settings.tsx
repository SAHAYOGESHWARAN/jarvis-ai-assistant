import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Voice Options</h2>
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Enable Wake Word ("Hey Jarvis")</span>
            </label>
            <label className="flex items-center">
              <span className="mr-2">Voice:</span>
              <select className="p-2 border rounded-lg">
                <option>Male</option>
                <option>Female</option>
              </select>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Theme</h2>
          <div className="mt-2">
            <label className="flex items-center">
              <input type="radio" name="theme" value="light" className="form-radio" defaultChecked />
              <span className="ml-2">Light Mode</span>
            </label>
            <label className="flex items-center mt-1">
              <input type="radio" name="theme" value="dark" className="form-radio" />
              <span className="ml-2">Dark Mode</span>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="mt-2">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" defaultChecked/>
              <span className="ml-2">Enable Email Notifications for Security Alerts</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
