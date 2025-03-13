import { useState, useEffect, useCallback } from 'react';
import { prospectsApi } from '../services/api';
import { Prospect, ProspectCreate } from '../types';

export const useProspects = (initialSkip = 0, initialLimit = 100, initialIndustry?: string) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [skip, setSkip] = useState(initialSkip);
  const [limit, setLimit] = useState(initialLimit);
  const [industry, setIndustry] = useState(initialIndustry);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await prospectsApi.getAll(skip, limit, industry);
      setProspects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch prospects'));
    } finally {
      setLoading(false);
    }
  }, [skip, limit, industry]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  const createProspect = async (prospect: ProspectCreate) => {
    try {
      const newProspect = await prospectsApi.create(prospect);
      setProspects(prevProspects => [...prevProspects, newProspect]);
      return newProspect;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create prospect'));
      throw err;
    }
  };

  const updateProspect = async (id: number, prospect: Partial<ProspectCreate>) => {
    try {
      const updatedProspect = await prospectsApi.update(id, prospect);
      setProspects(prevProspects =>
        prevProspects.map(p => (p.id === id ? updatedProspect : p))
      );
      return updatedProspect;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update prospect'));
      throw err;
    }
  };

  const deleteProspect = async (id: number) => {
    try {
      await prospectsApi.delete(id);
      setProspects(prevProspects => prevProspects.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete prospect'));
      throw err;
    }
  };

  const importProspects = async (prospectsToImport: ProspectCreate[]) => {
    try {
      const importedProspects = await prospectsApi.importProspects(prospectsToImport);
      setProspects(prevProspects => [...prevProspects, ...importedProspects]);
      return importedProspects;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to import prospects'));
      throw err;
    }
  };

  const importCsv = async (file: File) => {
    try {
      const importedProspects = await prospectsApi.importCsv(file);
      setProspects(prevProspects => [...prevProspects, ...importedProspects]);
      return importedProspects;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to import CSV'));
      throw err;
    }
  };

  return {
    prospects,
    loading,
    error,
    fetchProspects,
    createProspect,
    updateProspect,
    deleteProspect,
    importProspects,
    importCsv,
    setSkip,
    setLimit,
    setIndustry,
  };
};

export const useProspect = (id: number) => {
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProspect = useCallback(async () => {
    setLoading(true);
    try {
      const data = await prospectsApi.getById(id);
      setProspect(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch prospect with id ${id}`));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProspect();
    }
  }, [id, fetchProspect]);

  return {
    prospect,
    loading,
    error,
    refetch: fetchProspect,
  };
};
