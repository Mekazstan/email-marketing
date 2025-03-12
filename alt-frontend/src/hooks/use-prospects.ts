import { useState, useEffect, useCallback } from 'react';
import { getProspects, createProspect, updateProspect, deleteProspect, importProspects, Prospect } from '../services/api';

export const useProspects = (initialIndustry?: string) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | undefined>(initialIndustry);

  const fetchProspects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProspects(industry);
      setProspects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [industry]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  const addProspect = async (prospect: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const newProspect = await createProspect(prospect);
      setProspects([...prospects, newProspect]);
      return newProspect;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProspect = async (id: number, prospect: Partial<Prospect>) => {
    try {
      setLoading(true);
      const updatedProspect = await updateProspect(id, prospect);
      setProspects(prospects.map(p => p.id === id ? updatedProspect : p));
      return updatedProspect;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProspect = async (id: number) => {
    try {
      setLoading(true);
      await deleteProspect(id);
      setProspects(prospects.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkImport = async (importedProspects: Array<Omit<Prospect, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      const newProspects = await importProspects(importedProspects);
      setProspects([...prospects, ...newProspects]);
      return newProspects;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const filterByIndustry = (newIndustry?: string) => {
    setIndustry(newIndustry);
  };

  return {
    prospects,
    loading,
    error,
    addProspect,
    editProspect,
    removeProspect,
    bulkImport,
    filterByIndustry,
    refresh: fetchProspects
  };
};
