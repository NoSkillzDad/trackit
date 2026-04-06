"use client";

import {useDisclosure} from '@mantine/hooks';
import {Modal, Button, TextInput, Stack} from '@mantine/core';
import {useState} from 'react';
import {createTracker} from '@/lib/actions';

export function AddTrackerModal() {
    const [opened, {open, close}] = useDisclosure(false);
    const [name, setName] = useState('');

    const handleSave = async () => {
        if (!name.trim()) return;
        await createTracker(name);
        setName('');
        close();
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="New Tracker" centered size="sm">
                <Stack>
                    <TextInput
                        placeholder="What are we tracking?"
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                        }}
                        data-autofocus
                    />
                    <Button onClick={handleSave} fullWidth color="dark">
                        Create
                    </Button>
                </Stack>
            </Modal>

            <Button variant="default" onClick={open} fullWidth radius="md">
                Add Tracker
            </Button>
        </>
    );

    // return (
    //     <>
    //         <Modal opened={opened} onClose={close} title="Add New Tracker" centered>
    //             <Stack>
    //                 <TextInput
    //                     label="Tracker Name"
    //                     placeholder="e.g. Apples"
    //                     value={name}
    //                     onChange={(e) => setName(e.currentTarget.value)}
    //                     data-autofocus
    //                 />
    //                 <Button onClick={handleSave} fullWidth>
    //                     Save Tracker
    //                 </Button>
    //             </Stack>
    //         </Modal>
    //
    //         <Button
    //             leftSection={<IconPlus size={18} />}
    //             variant="filled"
    //             onClick={open}
    //             fullWidth
    //         >
    //             New Tracker
    //         </Button>
    //     </>
    // );
}