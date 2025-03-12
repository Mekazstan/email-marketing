const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Prospect {
  id: number;
  company_name: string;
  industry: string;
  website?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailContent {
  subject: string;
  body: string;
  metadata?: any;
}

export interface EmailResponse {
  prospect_id: number;
  company_name: string;
  industry: string;
  email_subject: string;
  email_body: string;
  engagement_advice: string;
  engagement_id?: number;
  sent_at?: string;
}

export interface CallScriptResponse {
  prospect_id: number;
  company_name: string;
  industry: string;
  script_title: string;
  script_content: string;
  engagement_id?: number;
  call_initiated_at?: string;
}

// Prospect API
export const getProspects = async (industry?: string): Promise<Prospect[]> => {
  const params = industry ? `?industry=${encodeURIComponent(industry)}` : '';
  const response = await fetch(`${API_BASE_URL}/prospects${params}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching prospects: ${response.statusText}`);
  }
  
  return response.json();
};

export const getProspect = async (id: number): Promise<Prospect> => {
  const response = await fetch(`${API_BASE_URL}/prospects/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching prospect: ${response.statusText}`);
  }
  
  return response.json();
};

export const createProspect = async (prospect: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>): Promise<Prospect> => {
  const response = await fetch(`${API_BASE_URL}/prospects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prospect)
  });
  
  if (!response.ok) {
    throw new Error(`Error creating prospect: ${response.statusText}`);
  }
  
  return response.json();
};

export const updateProspect = async (id: number, prospect: Partial<Prospect>): Promise<Prospect> => {
  const response = await fetch(`${API_BASE_URL}/prospects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prospect)
  });
  
  if (!response.ok) {
    throw new Error(`Error updating prospect: ${response.statusText}`);
  }
  
  return response.json();
};

export const deleteProspect = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/prospects/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error(`Error deleting prospect: ${response.statusText}`);
  }
};

export const importProspects = async (prospects: Array<Omit<Prospect, 'id' | 'created_at' | 'updated_at'>>): Promise<Prospect[]> => {
  const response = await fetch(`${API_BASE_URL}/prospects/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospects })
  });
  
  if (!response.ok) {
    throw new Error(`Error importing prospects: ${response.statusText}`);
  }
  
  return response.json();
};

// Email API
export const generateEmail = async (prospectId: number): Promise<EmailResponse> => {
  const response = await fetch(`${API_BASE_URL}/emails/generate?prospect_id=${prospectId}`);
  
  if (!response.ok) {
    throw new Error(`Error generating email: ${response.statusText}`);
  }
  
  return response.json();
};

export const sendEmail = async (prospectId: number): Promise<EmailResponse> => {
  const response = await fetch(`${API_BASE_URL}/emails/send?prospect_id=${prospectId}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error(`Error sending email: ${response.statusText}`);
  }
  
  return response.json();
};

export const sendBatchEmails = async (prospectIds: number[]): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/emails/send-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospect_ids: prospectIds })
  });
  
  if (!response.ok) {
    throw new Error(`Error sending batch emails: ${response.statusText}`);
  }
  
  return response.json();
};

// Call API (Bonus)
export const generateCallScript = async (prospectId: number): Promise<CallScriptResponse> => {
  const response = await fetch(`${API_BASE_URL}/calls/generate-script?prospect_id=${prospectId}`);
  
  if (!response.ok) {
    throw new Error(`Error generating call script: ${response.statusText}`);
  }
  
  return response.json();
};

export const makeCall = async (prospectId: number): Promise<CallScriptResponse> => {
  const response = await fetch(`${API_BASE_URL}/calls/make-call?prospect_id=${prospectId}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error(`Error making call: ${response.statusText}`);
  }
  
  return response.json();
};

export const updateCallOutcome = async (engagementId: number, outcome: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/calls/update-outcome?engagement_id=${engagementId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(outcome)
  });
  
  if (!response.ok) {
    throw new Error(`Error updating call outcome: ${response.statusText}`);
  }
  
  return response.json();
};
