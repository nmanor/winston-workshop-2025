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

    const getStabilityClass = (stability: number) => {
        if (stability >= 90) return styles.highStability;
        if (stability >= 75) return styles.mediumStability;
        return styles.lowStability;
    };

    return (
        <div className={styles.grid}>
            {servers.map((server) => (
                <div
                    key={server.id}
                    className={`${styles.card} ${getStabilityClass(server.stability)}`}
                >
                    <h3 className={styles.serverName}>{server.name}</h3>
                    <p className={styles.serverUrl}>URL: {server.url}</p>
                    <div className={styles.stabilityWrapper}>
                        <div className={styles.stabilityBar}>
                            <div 
                                className={styles.stabilityFill} 
                                style={{ width: `${server.stability}%` }}
                            />
                        </div>
                        <span className={styles.stabilityText}>
                            {server.stability}% Uptime
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default ServerList; 