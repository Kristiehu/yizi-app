import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yiii · 易紫",
  description: "多档案紫微斗数动态流盘 · Multi-profile Zi Wei Dou Shu with dynamic transits",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 语言是客户端状态（存在 localStorage，首次按浏览器语言猜），服务端渲染时并不知道，
    // 所以这里给一个默认值，真正的值由 app/page.tsx 的 effect 同步到 documentElement.lang。
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
