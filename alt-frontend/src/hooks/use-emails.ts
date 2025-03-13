import { useState } from 'react';
import { emailsApi } from '../services/api';
import { EmailGenerateResponse, EmailSendResponse } from '../types';

export const useEmails = () => {
  const [generatedEmail, setGeneratedEmail] = useState<EmailGenerateResponse | null>(null);
  const [sentEmail, setSentEmail] = useState<EmailSendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateEmail = async (prospectId: number) => {
    setLoading(true);
    try {
      const data = await emailsApi.generate(prospectId);
      setGeneratedEmail(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate email'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (prospectId: number) => {
    setLoading(true);
    try {
      const data = await emailsApi.send(prospectId);
      setSentEmail(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send email'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendBatchEmails = async (prospectIds: number[]) => {
    setLoading(true);
    try {
      const data = await emailsApi.sendBatch(prospectIds);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send batch emails'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEmailEngagement = async (engagementId: number) => {
    try {
      return await emailsApi.getEngagement(engagementId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get email engagement'));
      throw err;
    }
  };

  const trackEmailEngagement = async (engagementId: number, eventType: 'open' | 'click' | 'reply') => {
    try {
      return await emailsApi.trackEngagement(engagementId, eventType);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to track email engagement'));
      throw err;
    }
  };

  return {
    generatedEmail,
    sentEmail,
    loading,
    error,
    generateEmail,
    sendEmail,
    sendBatchEmails,
    getEmailEngagement,
    trackEmailEngagement,
  };
};
