'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './ServerList.module.css';
import { Server } from '@/types/server';

const REFRESH_INTERVAL = 10 * 1000; // 10 seconds

const ServerList = forwardRef<{ fetchServers: () => void }>(function ServerList(_, ref) {
    const [servers, setServers] = useState<Server[]>([]);
    const [timeUntilRefresh, setTimeUntilRefresh] = useState(REFRESH_INTERVAL);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchServers = async () => {
        const response = await fetch('/api/servers', { next: { tags: ['servers'] } });
        const data = await response.json();
        setServers(data);
        setTimeUntilRefresh(REFRESH_INTERVAL);
        setLastUpdate(new Date());
    };

    useImperativeHandle(ref, () => ({
        fetchServers
    }));

    useEffect(() => {
        fetchServers();
        const interval = setInterval(fetchServers, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeUntilRefresh(prev => Math.max(0, prev - 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getStabilityClass = (stability: number) => {
        if (stability >= 90) return styles.highStability;
        if (stability >= 75) return styles.mediumStability;
        return styles.lowStability;
    };

    const handleRemoveServer = async (id: number) => {
        try {
            const response = await fetch(`/api/servers?id=${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                fetchServers();
            }
        } catch (error) {
            console.error('Error removing server:', error);
        }
    };

    return (
        <>
            <div className={styles.refreshInfo}>
                <div className={styles.lastUpdate}>
                    Last update: {lastUpdate.toLocaleTimeString()}
                </div>
                <div className={styles.refreshTimer}>
                    Next refresh in {Math.ceil(timeUntilRefresh / 1000)}s
                </div>
            </div>
            <div className={styles.grid}>
                {servers.map((server) => (
                    <div
                        key={server.id}
                        className={`${styles.card} ${getStabilityClass(server.stability)}`}
                    >
                        <div className={styles.cardHeader}>
                            <h3 className={styles.serverName}>{server.name}</h3>
                            <button 
                                onClick={() => handleRemoveServer(server.id)}
                                className={styles.removeButton}
                                aria-label="Remove server"
                            >
                                ×
                            </button>
                        </div>
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
        </>
    );
});

export default ServerList; 