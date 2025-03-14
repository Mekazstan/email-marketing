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
  
  export interface ProspectCreate {
    company_name: string;
    industry: string;
    website?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
  }
  
  export interface ProspectImport {
    prospects: ProspectCreate[];
  }
  
  export interface Engagement {
    id: number;
    prospect_id: number;
    type: 'email' | 'call';
    content: string;
    sent_at: string;
    opened: boolean;
    clicked: boolean;
    responded: boolean;
    engagement_score: number;
    notes?: string;
  }
  
  export interface EmailContent {
    subject: string;
    body: string;
    metadata?: {
      industry_specifics?: {
        keywords: string[];
        pain_points: string[];
        selling_points: string[];
      };
      engagement_approach?: {
        approach: string;
        tone: string;
        focus: string;
        call_to_action: string;
      };
      potential_objections?: string[];
    };
  }
  
  export interface EmailGenerateResponse {
    prospect_id: number;
    company_name: string;
    industry: string;
    email_subject: string;
    email_body: string;
    engagement_advice: string;
  }
  
  export interface EmailSendResponse extends EmailGenerateResponse {
    engagement_id: number;
    sent_at: string;
  }
  
  export interface CallScriptContent {
    title: string;
    script: string;
    metadata?: {
      industry_specifics?: {
        keywords: string[];
        pain_points: string[];
        selling_points: string[];
      };
      engagement_approach?: {
        approach: string;
        tone: string;
        focus: string;
        call_to_action: string;
      };
    };
  }
  
  export interface CallScriptGenerateResponse {
    prospect_id: number;
    company_name: string;
    industry: string;
    script_title: string;
    script_content: string;
  }
  
  export interface CallMakeResponse extends CallScriptGenerateResponse {
    engagement_id: number;
    call_initiated_at: string;
  }
  
  export interface CallOutcome {
    connected: boolean;
    interested: boolean;
    notes: string;
  }
