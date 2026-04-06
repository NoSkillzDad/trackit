"use client";

import {useLiveQuery} from "dexie-react-hooks";
import {db, Tracker} from "@/lib/db";
import {deleteTracker, logEvent, updateTrackerName} from "@/lib/actions";
import {
    AppShell, Container, Title, Text, Card, Button,
    Stack, Group, Badge, ActionIcon, Menu, Tooltip, Modal, Checkbox, TextInput,
    Box, MenuDivider
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconPlus, IconMenu2, IconHistory, IconChartBar} from "@tabler/icons-react";
import {AddTrackerModal} from "./AddTrackerModal";
import {HistoryModal} from "./HistoryModal";
import {IconPencil, IconListNumbers, IconTrash} from "@tabler/icons-react";
import {useState} from "react";
import {HistoricalAddModal} from "@/components/HistoricalAddModal";
import {GlobalStatsModal} from "@/components/GlobalStatsModal";
import {TrackerHeatmap} from "@/components/TrackerHeatMap";
import {BarChart} from '@mantine/charts';
import '@mantine/charts/styles.css'; // Don't forget the CSS!

export function Dashboard() {
    // 1. Hook directly into the database.
    // UI updates automatically when data changes!
    const trackers = useLiveQuery(() => db.trackers.toArray()) || [];
    const logs = useLiveQuery(() => db.logs.toArray()) || [];

    // State for modals
    const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);
    const [deletingTracker, setDeletingTracker] = useState<Tracker | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [historyOpened, {open: openHistory, close: closeHistory}] = useDisclosure(false);
    const [globalStatsOpened, {open: openGlobalStats, close: closeGlobalStats}] = useDisclosure(false);

    // Inside your Dashboard component
    const [historicalOpened, {open: openHistorical, close: closeHistorical}] = useDisclosure(false);

    // Inside Dashboard.tsx
    const [historyTrackerId, setHistoryTrackerId] = useState<string | null>(null);

    const [statsTrackerId, setStatsTrackerId] = useState<number | null>(null);

// Helper to open history for a specific tracker
    const handleOpenHistory = (id: number) => {
        setHistoryTrackerId(String(id));
    };

    const [renameValue, setRenameValue] = useState("");

    // Open the modal and pre-fill the current name
    const handleOpenRename = (tracker: Tracker) => {
        setEditingTracker(tracker);
        setRenameValue(tracker.name);
    };

    // Save the changes to Dexie
    const handleSaveRename = async () => {
        if (editingTracker?.id && renameValue.trim()) {
            await updateTrackerName(editingTracker.id, renameValue.trim()); // Clean!
            setEditingTracker(null);
        }
    };

    const logsForThisTracker = logs.filter(l => l.trackerId === statsTrackerId);

    return (
        <AppShell
            header={{height: 60}}
            padding="md"
            styles={{
                main: {background: '#f8f9fa'}, // This targets the main content area specifically
            }}
        >
            <AppShell.Header p="md">
                {/* We use a Group with 100% width and justify="space-between" */}
                <Group justify="space-between" h="100%" px="md" wrap="nowrap">

                    {/* 1. Left Spacer: An empty Box with the same width as the menu button
          to keep the title perfectly centered */}
                    <Box w={40}/>

                    {/* 2. Centered Title */}
                    <Title
                        order={3}
                        fw={900}
                        c="blue.7"
                        style={{
                            letterSpacing: '-0.5px',
                            textAlign: 'center',
                            flex: 1 // Takes up remaining space to push the others to the edges
                        }}
                    >
                        TrackIt
                    </Title>

                    {/* 3. Right Menu: The Menu button with padding from the edge */}
                    <Box w={40} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                                <ActionIcon
                                    variant="light"
                                    radius="xl"
                                    size="lg"
                                    // Adding a small margin-right for extra breathing room from the screen edge
                                    mr="xs"
                                >
                                    <IconMenu2 size={20}/>
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item leftSection={<IconHistory size={14}/>}
                                           onClick={() => setHistoryTrackerId("")}>
                                    History
                                </Menu.Item>

                                <Menu.Item
                                    leftSection={<IconPlus size={14}/>}
                                    onClick={openHistorical}
                                >
                                    Log Past Event(s)
                                </Menu.Item>

                                {/*<Menu.Divider/>*/}
                                {/*<Menu.Label>Danger Zone</Menu.Label>*/}

                                <Menu.Item
                                    leftSection={<IconChartBar size={14}/>}
                                    onClick={openGlobalStats} // This opens the modal
                                >
                                    Statistics
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Box>

                </Group>
            </AppShell.Header>

            <AppShell.Main>
                <Container size="xs">
                    <Stack gap="xl">
                        <AddTrackerModal/>

                        <Stack gap="md">
                            {trackers.map((tracker) => {
                                // useLiveQuery ensures this 'count' is always fresh
                                const count = logs.filter(l => l.trackerId === tracker.id).length;

                                return (
                                    <Card key={tracker.id} shadow="sm" radius="md" withBorder p="lg">
                                        <Group justify="space-between" mb="xs">
                                            <Stack gap={0}>
                                                <Group gap="xs">
                                                    <Text fw={700} size="xl">{tracker.name}</Text>

                                                    {/* Action Icons Group */}
                                                    <Group gap={4}>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="gray"
                                                            size="sm"
                                                            // onClick={() => setEditingTracker(tracker)}
                                                            onClick={() => handleOpenRename(tracker)}
                                                        >
                                                            <IconPencil size={16}/>
                                                        </ActionIcon>

                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="gray"
                                                            size="sm"
                                                            onClick={() => tracker.id && handleOpenHistory(tracker.id)}/* Open History Modal for this ID */
                                                        >
                                                            <IconHistory size={16}/>
                                                        </ActionIcon>

                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="gray"
                                                            onClick={() => setStatsTrackerId(tracker.id || null)}>
                                                            <IconChartBar size={16}/>
                                                        </ActionIcon>

                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="red.4"
                                                            size="sm"
                                                            onClick={() => {
                                                                setDeletingTracker(tracker);
                                                                setConfirmDelete(false); // Reset checkbox
                                                            }}
                                                        >
                                                            <IconTrash size={16}/>
                                                        </ActionIcon>
                                                    </Group>
                                                </Group>
                                            </Stack>

                                            <Badge size="xl" variant="light" color="blue">{count}</Badge>
                                        </Group>

                                        <Button
                                            fullWidth
                                            mt="md"
                                            size="md"
                                            radius="md"
                                            leftSection={<IconPlus size={18}/>}
                                            onClick={() => tracker.id && logEvent(tracker.id)}
                                        >
                                            Log Entry
                                        </Button>
                                    </Card>
                                );
                            })}

                            {trackers.length === 0 && (
                                <Text c="dimmed" ta="center" mt="xl" size="sm">
                                    No trackers yet. Click the button above to create one.
                                </Text>
                            )}
                        </Stack>
                    </Stack>
                </Container>
            </AppShell.Main>

            {/*<HistoryModal opened={historyOpened} onClose={closeHistory}/>*/}

            <HistoryModal
                selectedId={historyTrackerId}
                onClose={() => setHistoryTrackerId(null)}
                onIdChange={setHistoryTrackerId}
            />

            <HistoricalAddModal
                opened={historicalOpened}
                onClose={closeHistorical}
            />

            {/*3. Rename Tracker Modal */}
            <Modal
                opened={!!editingTracker}
                onClose={() => setEditingTracker(null)}
                title="Rename Tracker"
                centered
                size="sm"
            >
                <Stack>
                    <TextInput
                        label="New Name"
                        placeholder="e.g. Daily Coffee"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename();
                        }}
                        data-autofocus // Automatically focus the input when modal opens
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" color="gray" onClick={() => setEditingTracker(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveRename}>
                            Update Name
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <GlobalStatsModal
                opened={globalStatsOpened}
                onClose={closeGlobalStats}
            />

            <Modal
                opened={statsTrackerId !== null}
                onClose={() => setStatsTrackerId(null)}
                title="Tracker Insights"
            >
                {/* Fetch logs for this specific tracker and pass to heatmap */}
                <TrackerHeatmap logs={logsForThisTracker}/>
            </Modal>

            {/*4. Delete Tracker Modal*/}
            <Modal
                opened={!!deletingTracker}
                onClose={() => setDeletingTracker(null)}
                title="Delete Tracker"
                centered
            >
                <Stack>
                    <Text size="sm">
                        Are you sure you want to delete <b>{deletingTracker?.name}</b>?
                        This will also remove all associated logs.
                    </Text>

                    <Checkbox
                        label="I understand that this action is irreversible"
                        checked={confirmDelete}
                        onChange={(event) => setConfirmDelete(event.currentTarget.checked)}
                        color="red"
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" onClick={() => setDeletingTracker(null)}>Cancel</Button>
                        <Button
                            color="red"
                            disabled={!confirmDelete}
                            onClick={async () => {
                                if (deletingTracker?.id) {
                                    await deleteTracker(deletingTracker.id); // Clean!
                                    setDeletingTracker(null);
                                }
                            }}
                        >
                            Delete Forever
                        </Button>
                    </Group>
                </Stack>
            </Modal>

        </AppShell>
    );
}