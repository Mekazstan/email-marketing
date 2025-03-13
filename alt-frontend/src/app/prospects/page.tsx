'use client';

import { useState } from 'react';
import ProspectList from '../../components/prospects/prospect-list';
import ImportProspects from '../../components/prospects/import-prospects';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';

export default function ProspectsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'import'>('list');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prospects</h1>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('list')}
        >
          All Prospects
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'import'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('import')}
        >
          Import Prospects
        </button>
      </div>

      {activeTab === 'list' ? <ProspectList /> : <ImportProspects />}
    </div>
  );
}
