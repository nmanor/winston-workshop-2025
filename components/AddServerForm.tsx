'use client';

import { useState } from 'react';
import styles from './AddServerForm.module.css';

interface AddServerFormProps {
  onServerAdded: () => void;
}

export default function AddServerForm({ onServerAdded }: AddServerFormProps) {
  const [serverData, setServerData] = useState({
    name: '',
    url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      });

      if (response.ok) {
        setServerData({ name: '', url: '' });
        onServerAdded(); // Notify parent that a server was added
      }
    } catch (error) {
      console.error('Error adding server:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Server Name"
        value={serverData.name}
        onChange={(e) => setServerData({ ...serverData, name: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="url"
        placeholder="Server URL"
        value={serverData.url}
        onChange={(e) => setServerData({ ...serverData, url: e.target.value })}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button}>
        Add Server
      </button>
    </form>
  );
} 