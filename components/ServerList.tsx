'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './ServerList.module.css';
import { Server } from '@/types/server';

const ServerList = forwardRef<{ fetchServers: () => void }>(function ServerList(_, ref) {
    const [servers, setServers] = useState<Server[]>([]);

    const fetchServers = async () => {
        const response = await fetch('/api/servers', { next: { tags: ['servers'] } });
        const data = await response.json();
        setServers(data);
    };

    useImperativeHandle(ref, () => ({
        fetchServers
    }));

    useEffect(() => {
        fetchServers();
        const interval = setInterval(fetchServers, 10 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.grid}>
            {servers.map((server) => (
                <div
                    key={server.id}
                    className={`${styles.card} ${styles[server.status]}`}
                >
                    <h3 className={styles.serverName}>{server.name}</h3>
                    <p className={styles.serverUrl}>URL: {server.url}</p>
                    <p className={styles.status}>
                        Status: <span className={styles[`status${server.status}`]}>{server.status}</span>
                    </p>
                </div>
            ))}
        </div>
    );
});

export default ServerList; 