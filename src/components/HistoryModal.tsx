"use client";

import {Modal, Select, Stack, Text, ScrollArea, Paper, Group, Button} from "@mantine/core";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@/lib/db";
import {IconTrash, IconHistory} from '@tabler/icons-react';
import {deleteLogEntry} from '@/lib/actions';
import {ActionIcon, Tooltip} from '@mantine/core';
import {useState} from "react";


interface HistoryModalProps {
    selectedId: string | null;            // The ID passed from the dashboard
    onClose: () => void;
    onIdChange: (id: string | null) => void; // To update the ID if they use the dropdown
}

export function HistoryModal({selectedId, onClose, onIdChange}: HistoryModalProps) {
    const trackers = useLiveQuery(() => db.trackers.toArray()) || [];
    const logs = useLiveQuery(() => db.logs.toArray()) || [];

    const [deletingLogId, setDeletingLogId] = useState<number | null>(null);

    // Filter logs using the selectedId prop
    const filteredLogs = logs
        .filter(log => log.trackerId === Number(selectedId))
        .sort((a, b) => b.timestamp - a.timestamp);


    return (<>
            <Modal
                opened={selectedId !== null}
                onClose={onClose}
                title="Activity History"
                centered
            >
                <Stack>
                    <Select
                        label="Viewing history for:"
                        placeholder="Select a tracker"
                        data={trackers.map(t => ({value: String(t.id), label: t.name}))}
                        value={selectedId}
                        onChange={onIdChange} // Allows switching trackers while inside the modal
                        clearable
                    />
                    <Text size="sm" fw={700} c="dimmed" mt="md">Entries</Text>

                    <ScrollArea h={300} type="always">
                        <Stack gap="xs">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <Paper key={log.id} withBorder p="xs" radius="sm" bg="gray.0">
                                        <Group justify="space-between" wrap="nowrap">
                                            <Stack gap={0}>
                                                <Text size="sm" fw={500}>
                                                    {new Date(log.timestamp).toLocaleDateString()}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {new Date(log.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Text>
                                            </Stack>

                                            <Tooltip label="Delete entry" position="left" withArrow>
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => setDeletingLogId(log.id!)}
                                                >
                                                    <IconTrash size={16} stroke={1.5}/>
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Paper>
                                    // <Paper key={log.id} withBorder p="xs" radius="sm" bg="gray.0">
                                    //     <Group justify="space-between">
                                    //         <Text size="sm" fw={500}>
                                    //             {new Date(log.timestamp).toLocaleDateString()}
                                    //         </Text>
                                    //         <Text size="xs" c="dimmed">
                                    //             {new Date(log.timestamp).toLocaleTimeString([], {
                                    //                 hour: '2-digit',
                                    //                 minute: '2-digit'
                                    //             })}
                                    //         </Text>
                                    //     </Group>
                                    // </Paper>
                                ))
                            ) : (
                                <Text c="dimmed" ta="center" py="xl" size="sm">
                                    {selectedId ? "No entries found for this tracker." : "Select a tracker to see history."}
                                </Text>
                            )}
                        </Stack>
                    </ScrollArea>
                </Stack>
            </Modal>

            <Modal
                opened={deletingLogId !== null}
                onClose={() => setDeletingLogId(null)}
                title="Confirm Deletion"
                size="sm"
                centered
                zIndex={3000} // Ensure it sits on top of the History Modal
            >
                <Stack>
                    <Text size="sm">
                        Are you sure you want to delete this entry? This action cannot be undone.
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="light" color="gray" onClick={() => setDeletingLogId(null)}>
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            onClick={async () => {
                                if (deletingLogId) {
                                    await deleteLogEntry(deletingLogId);
                                    setDeletingLogId(null);
                                }
                            }}
                        >
                            Delete Entry
                        </Button>
                    </Group>
                </Stack>
            </Modal>

        </>
    );
}

