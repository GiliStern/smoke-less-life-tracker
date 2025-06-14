
import { useState, useEffect, useCallback } from 'react';
import { SmokeLog } from '@/types';

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

  const addLog = useCallback((newLog: Omit<SmokeLog, 'id' | 'timestamp'>) => {
    const logWithTimestamp: SmokeLog = {
      ...newLog,
      id: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    
    setLogs(prevLogs => {
      const updatedLogs = [logWithTimestamp, ...prevLogs];
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
