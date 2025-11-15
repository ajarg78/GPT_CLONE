import { useState, useEffect } from 'react';

export const useSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const sessionsData = await response.json();
      setSessions(sessionsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      const data = await response.json();
      await loadSessions(); // Reload sessions to include the new one
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating session:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    createSession,
  };
};