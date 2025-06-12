import '../app/globals.css';
import Layout from '../components/Layout/Layout';

/**
 * Custom App Component
 * Wraps all pages with the main layout
 */
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}