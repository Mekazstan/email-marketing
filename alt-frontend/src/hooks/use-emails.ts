import { useState } from 'react';
import { generateEmail, sendEmail, sendBatchEmails, EmailResponse } from '../services/api';

export const useEmails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailData, setEmailData] = useState<EmailResponse | null>(null);

  const generateEmailContent = async (prospectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await generateEmail(prospectId);
      setEmailData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailContent = async (prospectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await sendEmail(prospectId);
      setEmailData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailBatch = async (prospectIds: number[]) => {
    try {
      setLoading(true);
      setError(null);
      const data = await sendBatchEmails(prospectIds);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    emailData,
    generateEmailContent,
    sendEmailContent,
    sendEmailBatch
  };
};
