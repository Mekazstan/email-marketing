import { Metadata } from 'next';
import './globals.css';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

export const metadata: Metadata = {
  title: 'AI Outreach - Insurance Industry Personalized Communication',
  description: 'AI-driven personalized cold email and call system for insurance companies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
