'use client';

import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Button, Text, Group } from '@mantine/core';
import { IconDownload, IconShare } from '@tabler/icons-react';

// Add this interface at the top of your file
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// This "augments" the global Window interface
declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

export function PWAInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        // 1. Logic for Chrome / Android / Desktop (beforeinstallprompt)
        const handleBaseInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);

            notifications.show({
                id: 'install-pwa',
                title: 'Install TrackIt',
                message: (
                    <>
                        <Text size="sm" mb="xs">
                            Install TrackIt to your home screen for the best experience and offline access.
                        </Text>
                        <Group justify="flex-end">
                            <Button variant="subtle" size="xs" onClick={() => notifications.hide('install-pwa')}>
                                Maybe Later
                            </Button>
                            <Button
                                size="xs"
                                leftSection={<IconDownload size={14} />}
                                onClick={() => {
                                    e.prompt();
                                    notifications.hide('install-pwa');
                                }}
                            >
                                Install
                            </Button>
                        </Group>
                    </>
                ),
                autoClose: false,
            });
        };

        // 2. Logic for iOS (Manual check)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        // Check if the app is already installed/running in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIOS && !isStandalone) {
            notifications.show({
                id: 'ios-install',
                title: 'Install on iPhone',
                color: 'blue',
                message: (
                    <Text size="sm">
                        To install: Tap the <strong>Share</strong> icon <IconShare size={14} style={{ display: 'inline' }} /> and then <strong>{'Add to Home Screen'}</strong>.
                    </Text>
                ),
                autoClose: 10000, // Show for 10 seconds
            });
        }

        // Attach the event listener for Android/Chrome
        window.addEventListener('beforeinstallprompt', handleBaseInstallPrompt );

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBaseInstallPrompt );
        };
    }, []);

    return null;
}