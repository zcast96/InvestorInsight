// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import SettingsForm from '@/components/settings/SettingsForm';

const Settings: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
      
      <SettingsForm />
    </div>
  );
};

export default Settings;
