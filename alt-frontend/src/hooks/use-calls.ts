import { useState } from 'react';
import { generateCallScript, makeCall, updateCallOutcome, CallScriptResponse } from '../services/api';

export const useCalls = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptData, setScriptData] = useState<CallScriptResponse | null>(null);

  const generateScript = async (prospectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await generateCallScript(prospectId);
      setScriptData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initiateCall = async (prospectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await makeCall(prospectId);
      setScriptData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recordCallOutcome = async (engagementId: number, outcome: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateCallOutcome(engagementId, outcome);
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
    scriptData,
    generateScript,
    initiateCall,
    recordCallOutcome
  };
};
