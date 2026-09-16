import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "./context/AuthContext.js";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Judgr — Build. Compete. Get Judged.",
  description: "Discover hackathons, build teams, and bring your best work to life.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <NavBar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
