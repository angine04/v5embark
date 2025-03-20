import type { Metadata } from "next";
import "./globals.css";
import { lato } from "./fonts";

export const metadata: Metadata = {
  title: '欢迎来到v5++ | v5Embark',
  description: 'v5++ 新队员注册系统',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${lato.variable} font-lato`}>
        {children}
      </body>
    </html>
  );
}
