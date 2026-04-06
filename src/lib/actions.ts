import {db, Tracker, Log} from './db';

// Create a new tracker (e.g., "Apples")
export const createTracker = async (name: string, color?: string) => {
    return await db.trackers.add({
        name,
        color: color || '#3b82f6', // Default blue
        createdAt: Date.now(),
    });
};

// Log an event (Increment the counter)
export const logEvent = async (trackerId: number) => {
    return await db.logs.add({
        trackerId,
        timestamp: Date.now(),
    });
};

// Delete a tracker and its history
export const deleteTracker = async (trackerId: number) => {
    return await db.transaction('rw', [db.trackers, db.logs], async () => {
        await db.logs.where('trackerId').equals(trackerId).delete();
        await db.trackers.delete(trackerId);
    });
};

// Rename a tracker
export const updateTrackerName = async (trackerId: number, newName: string) => {
    return await db.trackers.update(trackerId, { name: newName });
};

// Create historical entries
export const createHistoricalEntry = async (trackerId: number, date: Date, count: number) => {
    const baseTimestamp = date.setHours(12, 0, 0, 0); // Normalize to Noon

    const entries = Array.from({ length: count }).map((_, i) => ({
        trackerId,
        timestamp: baseTimestamp + (i * 1000), // 1-second jitter
    }));

    return await db.logs.bulkAdd(entries);
};

// src/lib/actions.ts

// Delete a specific log entry by its ID
export const deleteLogEntry = async (logId: number) => {
    return await db.logs.delete(logId);
};