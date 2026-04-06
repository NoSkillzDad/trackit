import { Modal, Text, Stack } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function GlobalStatsModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
    const stats = useLiveQuery(async () => {
        const trackers = await db.trackers.toArray();
        const logs = await db.logs.toArray();

        return trackers.map(t => ({
            name: t.name,
            count: logs.filter(l => l.trackerId === t.id).length
        })).sort((a, b) => b.count - a.count); // Sort highest to lowest
    }) || [];

    return (
        <Modal opened={opened} onClose={onClose} title="Overall Performance" size="lg">
            <Stack>
                <Text size="sm" c="dimmed">Total events recorded per category:</Text>
                <BarChart
                    h={300}
                    data={stats}
                    dataKey="name"
                    orientation="vertical"
                    yAxisProps={{ width: 100 }}
                    series={[{ name: 'count', color: 'blue.6' }]}
                />
            </Stack>
        </Modal>
    );
}