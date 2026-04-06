import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import {ColorSchemeScript, MantineProvider} from "@mantine/core";

import type { Metadata } from "next";
import ServiceWorkerRegister from "@/app/ServiceWorkerRegister";
import React from "react";

export const metadata: Metadata = {
    title: "TrackIt",
    description: "Simple tracking app",
    manifest: "/manifest.json",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>


        <head>
            <ColorSchemeScript/>
        </head>
        <body>
        {/* Force a clean theme */}
        <MantineProvider defaultColorScheme="light">
            <ServiceWorkerRegister/>
            {children}
        </MantineProvider>
        <script dangerouslySetInnerHTML={{
            __html: `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
`
        }}/>
        </body>
        </html>
    );
}
