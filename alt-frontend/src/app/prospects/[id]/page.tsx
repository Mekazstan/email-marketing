'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProspect } from '../../../hooks/use-prospects';
import { ProspectCreate } from '../../../types';
import ProspectForm from '../../../components/prospects/prospect-form';
import { useEmails } from '../../../hooks/use-emails';
import { useCalls } from '../../../hooks/use-calls';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import Button from '../../../components/ui/button';
import { prospectsApi } from '../../../services/api';

export default function ProspectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const prospectId = parseInt(params.id);
  const { prospect, loading, error } = useProspect(prospectId);
  const [isEditing, setIsEditing] = useState(false);
  const { generateEmail } = useEmails();
  const { generateCallScript } = useCalls();

  const handleUpdate = async (data: ProspectCreate) => {
    await prospectsApi.update(prospectId, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this prospect?')) {
      await prospectsApi.delete(prospectId);
      router.push('/prospects');
    }
  };

  const handleGenerateEmail = async () => {
    try {
      await generateEmail(prospectId);
      router.push('/emails');
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    }
  };

  const handleGenerateCallScript = async () => {
    try {
      await generateCallScript(prospectId);
      router.push('/calls');
    } catch (error) {
      console.error('Error generating call script:', error);
      alert('Failed to generate call script. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading prospect details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error loading prospect: {error.message}</div>;
  }

  if (!prospect) {
    return <div className="text-center py-10 text-red-600">Prospect not found</div>;
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Prospect</h1>
        <ProspectForm 
          initialData={prospect} 
          onSubmit={handleUpdate} 
          isUpdate={true} 
        />
        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prospect Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle>{prospect.company_name}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200">
          <div className="py-3 flex">
            <div className="font-medium w-1/3">Industry</div>
            <div className="w-2/3">{prospect.industry}</div>
          </div>
          <div className="py-3 flex">
            <div className="font-medium w-1/3">Website</div>
            <div className="w-2/3">
              {prospect.website ? (
                <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {prospect.website}
                </a>
              ) : (
                'N/A'
              )}
            </div>
          </div>
          <div className="py-3 flex">
            <div className="font-medium w-1/3">Contact Person</div>
            <div className="w-2/3">{prospect.contact_person || 'N/A'}</div>
          </div>
          <div className="py-3 flex">
            <div className="font-medium w-1/3">Email</div>
            <div className="w-2/3">
              {prospect.email ? (
                <a href={`mailto:${prospect.email}`} className="text-blue-600 hover:underline">
                  {prospect.email}
                </a>
              ) : (
                'N/A'
              )}
            </div>
          </div>
          <div className="py-3 flex">
            <div className="font-medium w-1/3">Phone</div>
            <div className="w-2/3">
              {prospect.phone ? (
                <a href={`tel:${prospect.phone}`} className="text-blue-600 hover:underline">
                  {prospect.phone}
                </a>
              ) : (
                'N/A'
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
          <Button 
            variant="primary" 
            onClick={handleGenerateEmail}
            disabled={!prospect.email}
          >
            Generate Email
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleGenerateCallScript}
            disabled={!prospect.phone}
          >
            Generate Call Script
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
