import type { Metadata } from 'next';
import './globals.css';
import Layout from '../components/Layout/Layout';

export const metadata: Metadata = {
  title: 'Fashion Store - Your Premier Fashion Destination',
  description: 'Discover the latest trends in fashion with our premium collection of clothing and accessories. Quality meets style in every piece.',
  keywords: 'fashion, clothing, accessories, men, women, kids, style, trends',
  authors: [{ name: 'Fashion Store' }],
  creator: 'Fashion Store',
  publisher: 'Fashion Store',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fashionstore.com',
    title: 'Fashion Store - Your Premier Fashion Destination',
    description: 'Discover the latest trends in fashion with our premium collection of clothing and accessories.',
    siteName: 'Fashion Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fashion Store - Your Premier Fashion Destination',
    description: 'Discover the latest trends in fashion with our premium collection of clothing and accessories.',
    creator: '@fashionstore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}