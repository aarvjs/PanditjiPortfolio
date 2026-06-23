import { Cinzel, Lora } from "next/font/google";
import { LanguageProvider } from "../context/LanguageContext";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";
import FloatingActions from "../components/FloatingActions";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Neelmani Kripalu Satsang | Devotion & Seva",
  description: "Experience divine peace and devotion at Neelmani Kripalu Satsang. Join our upcoming satsangs, explore spiritual articles, and participate in holy seva campaigns.",
  metadataBase: new URL("http://localhost:3000"), // Fallback base URL for metadata
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-dark-brown">
        <LanguageProvider>
          <SiteSettingsProvider>
            {children}
            <FloatingActions />
          </SiteSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
