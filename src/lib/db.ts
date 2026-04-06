import Dexie, {type Table} from 'dexie';

export interface Tracker {
    id?: number;
    name: string;
    color?: string;
    createdAt: number;
}

export interface Log {
    id?: number;
    trackerId: number;
    timestamp: number;
    note?: string;
}

export class MyDatabase extends Dexie {
    trackers!: Table<Tracker>;
    logs!: Table<Log>;

    constructor() {
        super('EventTrackerDB');
        this.version(1).stores({
            trackers: '++id, name', // Primary key and indexed fields
            logs: '++id, trackerId, timestamp'
        });
    }
}

export const db = new MyDatabase();