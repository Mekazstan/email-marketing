import { useState } from 'react';
import { useProspects } from '../../hooks/use-prospects';
import { useEmails } from '../../hooks/use-emails';
import { Prospect, EmailGenerateResponse } from '../../types';
import Button from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import Select from '../ui/select';

export default function EmailGenerator() {
  const { prospects, loading: loadingProspects } = useProspects();
  const { generateEmail, sendEmail, loading: loadingEmail } = useEmails();
  
  const [selectedProspectId, setSelectedProspectId] = useState<number | ''>('');
  const [generatedContent, setGeneratedContent] = useState<EmailGenerateResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<'success' | 'error' | null>(null);

  const handleGenerateEmail = async () => {
    if (!selectedProspectId) {
      alert('Please select a prospect first');
      return;
    }

    try {
      const data = await generateEmail(Number(selectedProspectId));
      setGeneratedContent(data);
      setSentStatus(null);
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedProspectId) return;
    
    setIsSending(true);
    try {
      await sendEmail(Number(selectedProspectId));
      setSentStatus('success');
    } catch (error) {
      console.error('Error sending email:', error);
      setSentStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleProspectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProspectId(e.target.value ? Number(e.target.value) : '');
    setGeneratedContent(null);
    setSentStatus(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Personalized Email</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="prospect" className="block text-sm font-medium text-gray-700 mb-1">
                Select Prospect
              </label>
              <Select
                id="prospect"
                value={selectedProspectId}
                onChange={handleProspectChange}
                disabled={loadingProspects}
              >
                <option value="">-- Select a prospect --</option>
                {prospects.map((prospect) => (
                  <option key={prospect.id} value={prospect.id}>
                    {prospect.company_name} ({prospect.industry})
                  </option>
                ))}
              </Select>
              {loadingProspects && <p className="mt-1 text-sm text-gray-500">Loading prospects...</p>}
            </div>

            {selectedProspectId && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerateEmail}
                  isLoading={loadingEmail}
                  disabled={!selectedProspectId || loadingEmail}
                >
                  Generate Personalized Email
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card variant="elevated">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle>Generated Email Content</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Personalized for {generatedContent.company_name} ({generatedContent.industry})
            </p>
          </CardHeader>
          
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Subject Line</h4>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  {generatedContent.email_subject}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">Email Body</h4>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">
                  {generatedContent.email_body}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">Engagement Advice</h4>
                <div className="mt-1 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200 whitespace-pre-wrap">
                  {generatedContent.engagement_advice}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={handleSendEmail}
              isLoading={isSending}
              disabled={isSending}
            >
              Send Email Now
            </Button>
            
            {sentStatus === 'success' && (
              <div className="ml-3 text-green-600 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Email sent successfully!
              </div>
            )}
            
            {sentStatus === 'error' && (
              <div className="ml-3 text-red-600 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Failed to send email. Please try again.
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
