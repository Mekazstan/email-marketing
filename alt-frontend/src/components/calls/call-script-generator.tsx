import { useState } from 'react';
import { useProspects } from '../../hooks/use-prospects';
import { useCalls } from '../../hooks/use-calls';
import { CallScriptGenerateResponse } from '../../types';
import Button from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import Select from '../ui/select';

export default function CallScriptGenerator() {
  const { prospects, loading: loadingProspects } = useProspects();
  const { generateCallScript, makeCall, loading: loadingCall } = useCalls();
  
  const [selectedProspectId, setSelectedProspectId] = useState<number | ''>('');
  const [generatedScript, setGeneratedScript] = useState<CallScriptGenerateResponse | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'success' | 'error' | null>(null);

  const handleGenerateScript = async () => {
    if (!selectedProspectId) {
      alert('Please select a prospect first');
      return;
    }

    try {
      const data = await generateCallScript(Number(selectedProspectId));
      setGeneratedScript(data);
      setCallStatus(null);
    } catch (error) {
      console.error('Error generating call script:', error);
      alert('Failed to generate call script. Please try again.');
    }
  };

  const handleMakeCall = async () => {
    if (!selectedProspectId) return;
    
    setIsCalling(true);
    try {
      await makeCall(Number(selectedProspectId));
      setCallStatus('success');
    } catch (error) {
      console.error('Error making call:', error);
      setCallStatus('error');
    } finally {
      setIsCalling(false);
    }
  };

  const handleProspectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProspectId(e.target.value ? Number(e.target.value) : '');
    setGeneratedScript(null);
    setCallStatus(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Call Script</CardTitle>
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
                    {!prospect.phone && " - No phone number"}
                  </option>
                ))}
              </Select>
              {loadingProspects && <p className="mt-1 text-sm text-gray-500">Loading prospects...</p>}
            </div>

            {selectedProspectId && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerateScript}
                  isLoading={loadingCall}
                  disabled={!selectedProspectId || loadingCall}
                >
                  Generate Call Script
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedScript && (
        <Card variant="elevated">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle>{generatedScript.script_title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Personalized for {generatedScript.company_name} ({generatedScript.industry})
            </p>
          </CardHeader>
          
          <CardContent className="mt-4">
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200">
              {generatedScript.script_content}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={handleMakeCall}
              isLoading={isCalling}
              disabled={isCalling}
            >
              Make Call Now
            </Button>
            
            {callStatus === 'success' && (
              <div className="ml-3 text-green-600 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Call initiated successfully!
              </div>
            )}
            
            {callStatus === 'error' && (
              <div className="ml-3 text-red-600 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Failed to make call. Please try again.
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
