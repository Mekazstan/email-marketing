import { useState } from 'react';
import { CallScriptGenerateResponse, CallOutcome } from '../../types';
import { useCalls } from '../../hooks/use-calls';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import Button from '../ui/button';

interface CallScriptPreviewProps {
  callScript: CallScriptGenerateResponse;
  engagementId?: number;
}

export default function CallScriptPreview({ callScript, engagementId }: CallScriptPreviewProps) {
  const { updateCallOutcome } = useCalls();
  const [isExpanded, setIsExpanded] = useState(false);
  const [outcomeForm, setOutcomeForm] = useState<CallOutcome>({
    connected: false,
    interested: false,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitOutcome = async () => {
    if (!engagementId) return;
    
    setIsSubmitting(true);
    try {
      await updateCallOutcome(engagementId, outcomeForm);
      setSubmitted(true);
    } catch (error) {
      console.error('Error updating call outcome:', error);
      alert('Failed to update call outcome. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format script content by highlighting the pauses
  const formatScript = (script: string) => {
    return script.replace(
      /\[\[PAUSE\]\]/g, 
      '<span class="bg-yellow-100 text-yellow-800 px-1 rounded">PAUSE</span>'
    );
  };

  return (
    <Card variant="bordered" className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{callScript.script_title}</CardTitle>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          For: {callScript.company_name} ({callScript.industry})
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-4">
          <div 
            className={`prose max-w-none ${!isExpanded && 'max-h-60 overflow-hidden'}`}
            dangerouslySetInnerHTML={{ __html: formatScript(callScript.script_content) }}
          />
          
          {!isExpanded && (
            <button
              className="text-blue-600 text-sm mt-2 hover:underline"
              onClick={() => setIsExpanded(true)}
            >
              Show full script...
            </button>
          )}
          
          {isExpanded && (
            <button
              className="text-blue-600 text-sm mt-2 hover:underline"
              onClick={() => setIsExpanded(false)}
            >
              Show less
            </button>
          )}
        </div>
        
        {engagementId && !submitted && (
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Call Outcome</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="connected"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={outcomeForm.connected}
                  onChange={(e) => setOutcomeForm({...outcomeForm, connected: e.target.checked})}
                />
                <label htmlFor="connected" className="ml-2 text-sm text-gray-700">
                  Connected with decision maker
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="interested"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={outcomeForm.interested}
                  onChange={(e) => setOutcomeForm({...outcomeForm, interested: e.target.checked})}
                />
                <label htmlFor="interested" className="ml-2 text-sm text-gray-700">
                  Showed interest / Requested follow-up
                </label>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Call Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                  value={outcomeForm.notes}
                  onChange={(e) => setOutcomeForm({...outcomeForm, notes: e.target.value})}
                  placeholder="Enter notes about the call outcome..."
                />
              </div>
            </div>
          </div>
        )}
        
        {engagementId && submitted && (
          <div className="bg-green-50 p-4 border-t border-green-100 text-green-700">
            <p className="font-medium">Call outcome recorded successfully!</p>
            <p className="text-sm mt-1">
              {outcomeForm.connected ? 'Connected with decision maker. ' : 'Could not connect with decision maker. '}
              {outcomeForm.interested ? 'Prospect showed interest.' : 'Prospect did not show interest.'}
            </p>
            {outcomeForm.notes && (
              <div className="mt-2">
                <p className="text-sm font-medium">Notes:</p>
                <p className="text-sm">{outcomeForm.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {engagementId && !submitted && (
        <CardFooter>
          <Button
            onClick={handleSubmitOutcome}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Call Outcome
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
