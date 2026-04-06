import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import {ColorSchemeScript, MantineProvider} from "@mantine/core";

import type {Metadata} from "next";
import ServiceWorkerRegister from "@/app/ServiceWorkerRegister";
import React from "react";
import {PWAInstaller} from "@/components/PWAInstaller";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

export const metadata: Metadata = {
    title: "TrackIt",
    description: "Personal Activity Tracker",
    manifest: "/manifest.json",
    // viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "TrackIt",
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        {/* Force a clean theme */}
        <MantineProvider defaultColorScheme="light">
            <ServiceWorkerRegister/>
            <Notifications position="bottom-center" zIndex={1000} />
            <PWAInstaller/>
            {children}
            <script dangerouslySetInnerHTML={{
                __html: `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
    window.addEventListener("beforeinstallprompt", (e) => {
  console.log("PWA install prompt is available");
});

  }
`
            }}
            />
        </MantineProvider>

        </body>
        </html>
    );
}
