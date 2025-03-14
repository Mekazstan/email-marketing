import { useState } from 'react';
import { callsApi } from '../services/api';
import { CallScriptGenerateResponse, CallMakeResponse, CallOutcome } from '../types';

export const useCalls = () => {
  const [generatedScript, setGeneratedScript] = useState<CallScriptGenerateResponse | null>(null);
  const [callResult, setCallResult] = useState<CallMakeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateCallScript = async (prospectId: number) => {
    setLoading(true);
    try {
      const data = await callsApi.generateScript(prospectId);
      setGeneratedScript(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate call script'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makeCall = async (prospectId: number) => {
    setLoading(true);
    try {
      const data = await callsApi.makeCall(prospectId);
      setCallResult(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to make call'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCallOutcome = async (engagementId: number, outcome: CallOutcome) => {
    try {
      return await callsApi.updateOutcome(engagementId, outcome);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update call outcome'));
      throw err;
    }
  };

  return {
    generatedScript,
    callResult,
    loading,
    error,
    generateCallScript,
    makeCall,
    updateCallOutcome,
  };
};
