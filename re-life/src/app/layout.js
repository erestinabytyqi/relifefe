'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import { ThemeProvider } from '../components/ThemeProvider';
import { App as AntdApp, ConfigProvider } from 'antd';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <ConfigProvider>
            <AntdApp>
              <AuthProvider>
                {children}
              </AuthProvider>
            </AntdApp>
          </ConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
