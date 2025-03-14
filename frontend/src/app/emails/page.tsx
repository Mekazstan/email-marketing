'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EmailGenerator from '../../components/emails/email-generator';
import EmailPreview from '../../components/emails/email-preview';
import { useEmails } from '../../hooks/use-emails';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';

export default function EmailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prospectId = searchParams.get('prospectId');
  const { generatedEmail, generateEmail, loading } = useEmails();
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');

  // If prospectId is provided in the URL, auto-generate an email for that prospect
  useEffect(() => {
    if (prospectId) {
      generateEmail(parseInt(prospectId)).catch(error => {
        console.error('Error auto-generating email:', error);
      });
    }
  }, [prospectId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Personalization</h1>
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
          Generate Email
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Email History
        </button>
      </div>

      {activeTab === 'generate' ? (
        <EmailGenerator />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Email History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">
              Email history functionality will be implemented in future versions.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
