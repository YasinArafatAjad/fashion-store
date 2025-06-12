'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Mega Menu Component
 * Animated dropdown menu with categories and subcategories
 */
const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  /**
   * Sample categories data
   * In a real app, this would come from your database
   */
  const categories = [
    {
      id: 'men',
      name: 'Men',
      subcategories: [
        { name: 'T-Shirts', href: '/shop/men/t-shirts' },
        { name: 'Shirts', href: '/shop/men/shirts' },
        { name: 'Jeans', href: '/shop/men/jeans' },
        { name: 'Jackets', href: '/shop/men/jackets' },
        { name: 'Sneakers', href: '/shop/men/sneakers' },
        { name: 'Accessories', href: '/shop/men/accessories' }
      ]
    },
    {
      id: 'women',
      name: 'Women',
      subcategories: [
        { name: 'Dresses', href: '/shop/women/dresses' },
        { name: 'Tops', href: '/shop/women/tops' },
        { name: 'Jeans', href: '/shop/women/jeans' },
        { name: 'Skirts', href: '/shop/women/skirts' },
        { name: 'Heels', href: '/shop/women/heels' },
        { name: 'Handbags', href: '/shop/women/handbags' }
      ]
    },
    {
      id: 'kids',
      name: 'Kids',
      subcategories: [
        { name: 'Boys', href: '/shop/kids/boys' },
        { name: 'Girls', href: '/shop/kids/girls' },
        { name: 'Baby', href: '/shop/kids/baby' },
        { name: 'Shoes', href: '/shop/kids/shoes' },
        { name: 'Toys', href: '/shop/kids/toys' }
      ]
    },
    {
      id: 'accessories',
      name: 'Accessories',
      subcategories: [
        { name: 'Bags', href: '/shop/accessories/bags' },
        { name: 'Watches', href: '/shop/accessories/watches' },
        { name: 'Jewelry', href: '/shop/accessories/jewelry' },
        { name: 'Sunglasses', href: '/shop/accessories/sunglasses' },
        { name: 'Belts', href: '/shop/accessories/belts' }
      ]
    }
  ];

  /**
   * Close menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mega-menu')) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mega-menu relative">
      {/* Categories Trigger */}
      <div className="hidden lg:block bg-gray-50 dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsOpen(true)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              <span className="font-medium">All Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Links */}
            <div className="flex items-center space-x-6">
              <Link href="/shop/new-arrivals" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                New Arrivals
              </Link>
              <Link href="/shop/best-sellers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                Best Sellers
              </Link>
              <Link href="/shop/sale" className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium">
                Sale
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-xl z-40"
            onMouseLeave={() => {
              setIsOpen(false);
              setActiveCategory(null);
            }}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-5 gap-8">
                {/* Categories List */}
                <div className="col-span-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          onMouseEnter={() => setActiveCategory(category.id)}
                          className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                            activeCategory === category.id
                              ? 'bg-primary text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subcategories */}
                <div className="col-span-2">
                  <AnimatePresence mode="wait">
                    {activeCategory && (
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                          {categories.find(cat => cat.id === activeCategory)?.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {categories
                            .find(cat => cat.id === activeCategory)
                            ?.subcategories.map((subcategory, index) => (
                              <Link
                                key={index}
                                href={subcategory.href}
                                className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Featured Products */}
                <div className="col-span-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Featured Products
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sample featured products */}
                    <div className="group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center"
                          alt="Featured Product"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                        Summer T-Shirt
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ৳1,200
                      </p>
                    </div>
                    <div className="group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&crop=center"
                          alt="Featured Product"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                        Denim Jacket
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ৳3,500
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu;