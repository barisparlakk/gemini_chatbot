'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function Home() {
  const [message, setMessage] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/api/chat/', { message: input });
      setMessage(response.data.message);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Django + Next.js Chat App</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
          <div className="mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
          {message && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="text-gray-800">{message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
