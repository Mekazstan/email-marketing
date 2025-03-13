import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/helpers';
import { EmailSendResponse } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface EmailPreviewProps {
  email: EmailSendResponse;
  showAdvice?: boolean;
}

export default function EmailPreview({ email, showAdvice = true }: EmailPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format the email body for display
  const formatEmailBody = (body: string) => {
    return body.replace(/\n/g, '<br>');
  };

  return (
    <Card variant="bordered" className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{email.email_subject}</CardTitle>
          <span className="text-xs text-gray-500">
            {email.sent_at && `Sent: ${formatDate(email.sent_at)}`}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          To: {email.company_name} ({email.industry})
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-4">
          <div 
            className={`prose max-w-none ${!isExpanded && 'max-h-40 overflow-hidden'}`}
            dangerouslySetInnerHTML={{ __html: formatEmailBody(email.email_body) }}
          />
          
          {!isExpanded && (
            <button
              className="text-blue-600 text-sm mt-2 hover:underline"
              onClick={() => setIsExpanded(true)}
            >
              Read more...
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
        
        {showAdvice && email.engagement_advice && (
          <div className="bg-blue-50 p-4 border-t border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Engagement Advice</h4>
            <p className="text-sm text-blue-700 whitespace-pre-wrap">
              {email.engagement_advice}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
