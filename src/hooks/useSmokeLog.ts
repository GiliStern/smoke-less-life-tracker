
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
      } catch (error) {
        console.error("Failed to save smoke logs to localStorage", error);
      }
      return updatedLogs;
    });
  }, []);

  return { logs, addLog, loading };
};
