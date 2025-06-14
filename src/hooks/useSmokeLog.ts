
import { useState, useEffect, useCallback } from 'react';
import { SmokeLog, SmokeType } from '@/types';

const STORAGE_KEY = 'smokeControlLog';

export const useSmokeLog = () => {
  const [logs, setLogs] = useState<SmokeLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(STORAGE_KEY);
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Failed to load smoke logs from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = useCallback((updatedLogs: SmokeLog[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error("Failed to save smoke logs to localStorage", error);
    }
  }, []);

  const addLog = useCallback((logData: { type: SmokeType; trigger?: string; timestamp?: string }) => {
    const logTimestamp = logData.timestamp || new Date().toISOString();
    const newLog: SmokeLog = {
      id: crypto.randomUUID(),
      type: logData.type,
      timestamp: logTimestamp,
      trigger: logData.trigger,
    };
    
    setLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      saveToStorage(updatedLogs);
      return updatedLogs;
    });
  }, [saveToStorage]);

  const updateLog = useCallback((id: string, updatedData: Partial<SmokeLog>) => {
    setLogs(prevLogs => {
      const updatedLogs = prevLogs.map(log => 
        log.id === id ? { ...log, ...updatedData } : log
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      saveToStorage(updatedLogs);
      return updatedLogs;
    });
  }, [saveToStorage]);

  const deleteLog = useCallback((id: string) => {
    setLogs(prevLogs => {
      const updatedLogs = prevLogs.filter(log => log.id !== id);
      saveToStorage(updatedLogs);
      return updatedLogs;
    });
  }, [saveToStorage]);

  return { logs, addLog, updateLog, deleteLog, loading };
};
