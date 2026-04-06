import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import {ColorSchemeScript, MantineProvider} from "@mantine/core";

import type {Metadata} from "next";
import ServiceWorkerRegister from "@/app/ServiceWorkerRegister";
import React from "react";

export const metadata: Metadata = {
    title: "TrackIt",
    description: "Personal Activity Tracker",
    manifest: "/manifest.json",
    themeColor: "#228be6",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "TrackIt",
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>


        <head>
            <link rel="manifest" href="/manifest.json?v=3"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
            <meta name="theme-color" content="#228be6"/>
            <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png"/>
            <ColorSchemeScript/>
        </head>
        <body>
        {/* Force a clean theme */}
        <MantineProvider defaultColorScheme="light">
            <ServiceWorkerRegister/>
            {children}
            <script dangerouslySetInnerHTML={{
                __html: `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
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
