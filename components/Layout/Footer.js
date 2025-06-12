'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Heart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

/**
 * Advanced Animated Footer Component
 * Contains site links, newsletter signup, and contact information
 */
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  /**
   * Handle newsletter subscription
   */
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real app, you would handle the subscription here
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  /**
   * Footer sections data
   */
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'Men', href: '/shop/men' },
        { label: 'Women', href: '/shop/women' },
        { label: 'Kids', href: '/shop/kids' },
        { label: 'Accessories', href: '/shop/accessories' },
        { label: 'Sale', href: '/shop/sale' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
        { label: 'Size Guide', href: '/size-guide' },
        { label: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Sitemap', href: '/sitemap' }
      ]
    }
  ];

  /**
   * Animation variants
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to our newsletter for the latest fashion trends and exclusive offers
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-r-none bg-white text-gray-900"
                  required
                />
                <Button
                  type="submit"
                  className="rounded-l-none bg-white text-primary hover:bg-gray-100"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm"
                >
                  Thank you for subscribing! 🎉
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold text-white"
                >
                  Fashion Store
                </motion.div>
              </Link>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your premier destination for the latest fashion trends. We offer 
                high-quality clothing and accessories for men, women, and kids at 
                affordable prices.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-gray-300">+880 1234-567890</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-gray-300">info@fashionstore.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-gray-300">Dhaka, Bangladesh</span>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div key={index} variants={itemVariants}>
                <h3 className="text-lg font-semibold mb-6 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            {/* Copyright */}
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-gray-400">
                © 2024 Fashion Store. Made with
              </span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-gray-400">in Bangladesh</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;