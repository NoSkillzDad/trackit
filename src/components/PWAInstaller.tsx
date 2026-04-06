"use client"

import {useEffect, useState} from 'react';
import {notifications} from '@mantine/notifications';
import {Button, Text, Group} from '@mantine/core';
import {IconDownload} from '@tabler/icons-react';

export function PWAInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);

            if (isIOS && !isStandalone) {
                notifications.show({
                    title: 'Install on iPhone',
                    message: 'Tap the Share icon and select "Add to Home Screen" to use TrackIt as an app!',
                    color: 'blue',
                    autoClose: 10000,
                });
            } else {
                // Trigger the Toast once the event is captured
                notifications.show({
                    id: 'install-pwa',
                    title: 'Install TrackIt',
                    message: (
                        <>
                            <Text size="sm" mb="xs">
                                Install this app on your home screen for offline access and a better experience.
                            </Text>
                            <Group justify="flex-end">
                                <Button
                                    variant="light"
                                    size="xs"
                                    onClick={() => notifications.hide('install-pwa')}
                                >
                                    Maybe later
                                </Button>
                                <Button
                                    size="xs"
                                    leftSection={<IconDownload size={14}/>}
                                    onClick={() => handleInstall(e)}
                                >
                                    Install Now
                                </Button>
                            </Group>
                        </>
                    ),
                    autoClose: false, // Keep it open so they don't miss it
                    withCloseButton: true,
                });
            }
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async (promptEvent: any) => {
        if (!promptEvent) return;

        promptEvent.prompt();
        const {outcome} = await promptEvent.userChoice;

        if (outcome === 'accepted') {
            notifications.hide('install-pwa');
        }
        setDeferredPrompt(null);
    };

    return null; // This component doesn't render anything itself
}