'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CallScriptGenerator from '../../components/calls/call-script-generator';
import CallScriptPreview from '../../components/calls/call-script-preview';
import { useCalls } from '../../hooks/use-calls';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export default function CallsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prospectId = searchParams.get('prospectId');
  const { generatedScript, generateCallScript, loading } = useCalls();
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');

  // If prospectId is provided in the URL, auto-generate a script for that prospect
  useEffect(() => {
    if (prospectId) {
      generateCallScript(parseInt(prospectId)).catch(error => {
        console.error('Error auto-generating call script:', error);
      });
    }
  }, [prospectId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Call Scripts</h1>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'generate'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('generate')}
        >
          Generate Script
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Call History
        </button>
      </div>

      {activeTab === 'generate' ? (
        <CallScriptGenerator />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Call History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">
              Call history functionality will be implemented in future versions.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
