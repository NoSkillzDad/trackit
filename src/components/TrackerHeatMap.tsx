import { Group, Box, Tooltip, Text, Stack, Title } from '@mantine/core';
import dayjs from 'dayjs';

export function TrackerHeatmap({ logs }: { logs: any[] }) {
    // 1. Group logs by date string (YYYY-MM-DD)
    const countsByDate = logs.reduce((acc: any, log) => {
        const date = dayjs(log.timestamp).format('YYYY-MM-DD');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // 2. Generate last 90 days
    const days = Array.from({ length: 90 }).map((_, i) =>
        dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    ).reverse();

    // 3. Find the peak day/week
    const maxEntry = Object.entries(countsByDate).reduce((a: any, b: any) => a[1] > b[1] ? a : b, ["-", 0]);

    const getColor = (count: number) => {
        if (!count) return 'gray.1';
        if (count < 2) return 'blue.2';
        if (count < 5) return 'blue.4';
        if (count < 8) return 'blue.6';
        return 'blue.9';
    };

    return (
        <Stack gap="xs">
            <Title order={5}>90-Day Activity</Title>
            <Group gap={4} justify="center">
                {days.map(date => (
                    <Tooltip key={date} label={`${date}: ${countsByDate[date] || 0} events`}>
                        <Box
                            w={12}
                            h={12}
                            bg={getColor(countsByDate[date])}
                            style={{ borderRadius: '2px' }}
                        />
                    </Tooltip>
                ))}
            </Group>

            {maxEntry[1] > 0 && (
                <Text size="xs" c="dimmed" mt="xs">
                    <b>All-time peak:</b> {maxEntry[1]} events on {maxEntry[0]}
                </Text>
            )}
        </Stack>
    );
}