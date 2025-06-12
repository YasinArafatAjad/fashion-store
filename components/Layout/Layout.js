'use client';

import Header from './Header';
import Footer from './Footer';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

/**
 * Main Layout Component
 * Wraps all pages with necessary providers and layout components
 */
const Layout = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Layout;