'use client';

import ServerList from '@/components/ServerList';
import AddServerForm from '@/components/AddServerForm';
import styles from './page.module.css';
import { useRef } from 'react';

export default function Home() {
  const serverListRef = useRef<{ fetchServers: () => void }>(null);

  const handleServerAdded = () => {
    serverListRef.current?.fetchServers();
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Server Monitor</h1>
      <AddServerForm onServerAdded={handleServerAdded} />
      <ServerList ref={serverListRef} />
    </main>
  );
}
