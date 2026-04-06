"use client";

import {useState} from 'react';
import {Modal, Select, NumberInput, Button, Stack, Group, Text} from '@mantine/core';
import {DatePicker} from '@mantine/dates';
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@/lib/db";
import {createHistoricalEntry} from "@/lib/actions";
import * as dayjs_ from 'dayjs';
const dayjs = (dayjs_ as any).default || dayjs_;

interface HistoricalAddModalProps {
    opened: boolean;
    onClose: () => void;
}

export function HistoricalAddModal({opened, onClose}: HistoricalAddModalProps) {
    // 1. Fetch trackers inside the component so it knows what exists
    const trackers = useLiveQuery(() => db.trackers.toArray()) || [];

    // 2. Local state for the form
    const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(dayjs().format('YYYY-MM-DD'));
    const [count, setCount] = useState<number | string>(1);
    const [loading, setLoading] = useState(false);

    const dateAsObject = selectedDate ? dayjs(selectedDate).toDate() : new Date();
    // Inside HistoricalAddModal.tsx
    const [lastAddedDate, setLastAddedDate] = useState<string | null>(null);

    const isFormValid =
        selectedTrackerId !== null &&
        selectedDate !== null &&
        dayjs(selectedDate).isValid() &&
        Number(count) > 0;

    const handleAdd = async () => {
        if (!selectedTrackerId || !selectedDate) return;

        setLoading(true);
        try {
            await createHistoricalEntry(
                Number(selectedTrackerId),
                dateAsObject,
                Number(count)
            );
            // Reset form and close
            setCount(1);
            setSelectedTrackerId(null);
            setLastAddedDate(dateAsObject.toLocaleDateString());
            setTimeout(() => setLastAddedDate(null), 2000); // Clear message after 2s
            // onClose();
        } catch (error) {
            console.error("Failed to add historical entry:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Log Past Events" centered>
            <Stack>
                <Select
                    label="Which tracker?"
                    placeholder="Select an item"
                    data={trackers.map(t => ({ value: String(t.id), label: t.name }))}
                    value={selectedTrackerId}
                    onChange={(value: string | null) => setSelectedTrackerId(value)} // Explicitly typed
                    required
                />

                <Text size="sm" fw={500} mb={-10}>Select Date</Text>
                <Group justify="center" p="xs" style={{border: '1px solid #eee', borderRadius: '8px'}}>
                    <DatePicker
                        value={selectedDate}
                        onChange={(value: string | null) => setSelectedDate(value)} // Updated to handle string | null
                        maxDate={new Date().toISOString().split('T')[0]} // Also using string for maxDate
                    />
                </Group>

                <NumberInput
                    label="How many times?"
                    value={count}
                    onChange={(val) => setCount(val)} // Ensure it updates correctly
                    min={1}
                    max={99}
                />

                <Button
                    fullWidth
                    onClick={handleAdd}
                    loading={loading}
                    // disabled={!selectedTrackerId || !selectedDate}
                    color={lastAddedDate ? "green" : "blue"} // Turns green on success
                    disabled={!isFormValid}
                >
                    {/*{lastAddedDate*/}
                    {/*    ? `Added to ${lastAddedDate}!`*/}
                    {/*    : `Add ${count} to ${dateAsObject?.toLocaleDateString()}`}*/}
                    {/*/!* Add a safe check and a fallback string *!/*/}
                    {/*{isFormValid*/}
                    {/*    ? `Add ${count} ${Number(count) === 1 ? 'entry' : 'entries'} to ${dateAsObject.toLocaleDateString()}`*/}
                    {/*    : "Fill in all fields"}*/}

                    {
                        lastAddedDate
                            ? `Added to ${lastAddedDate}!`
                            : isFormValid
                                ? `Add ${count} ${Number(count) === 1 ? 'entry' : 'entries'} to ${dateAsObject?.toLocaleDateString()}`
                                : "Fill in all fields"
                    }

                    {/*Add {count} {count === 1 ? 'entry' : 'entries'}*/}
                    {/*{selectedDate instanceof Date && !isNaN(selectedDate.getTime())*/}
                    {/*    ? ` to ${selectedDate.toLocaleDateString()}`*/}
                    {/*    : ''}*/}
                </Button>
            </Stack>
        </Modal>
    );
}