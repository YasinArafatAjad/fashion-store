'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

/**
 * Categories Page Component
 * Displays all product categories with navigation
 */
export default function CategoriesPage() {
  const categories = [
    {
      id: 'men',
      name: 'Men\'s Fashion',
      description: 'Stylish clothing and accessories for men',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
      productCount: 150,
      subcategories: ['T-Shirts', 'Shirts', 'Jeans', 'Jackets', 'Sneakers', 'Accessories']
    },
    {
      id: 'women',
      name: 'Women\'s Fashion',
      description: 'Elegant and trendy fashion for women',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=400&h=300&fit=crop&crop=center',
      productCount: 200,
      subcategories: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Heels', 'Handbags']
    },
    {
      id: 'kids',
      name: 'Kids\' Fashion',
      description: 'Comfortable and fun clothing for children',
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=300&fit=crop&crop=center',
      productCount: 80,
      subcategories: ['Boys', 'Girls', 'Baby', 'Shoes', 'Toys']
    },
    {
      id: 'accessories',
      name: 'Accessories',
      description: 'Complete your look with our accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center',
      productCount: 120,
      subcategories: ['Bags', 'Watches', 'Jewelry', 'Sunglasses', 'Belts']
    }
  ];

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
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our diverse collection of fashion categories and find exactly what you're looking for
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  
                  {/* Category Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {category.productCount} Products
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Subcategories */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Popular Subcategories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((subcategory, index) => (
                        <Link
                          key={index}
                          href={`/shop/${category.id}/${subcategory.toLowerCase().replace(' ', '-')}`}
                          className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Shop Category Button */}
                  <Link href={`/shop?category=${category.id}`}>
                    <Button className="w-full">
                      Shop {category.name}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Collections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
              <h3 className="text-xl font-semibold mb-2">New Arrivals</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Latest fashion trends just arrived
              </p>
              <Link href="/shop?sort=newest">
                <Button variant="outline">
                  Explore New
                </Button>
              </Link>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5">
              <h3 className="text-xl font-semibold mb-2">Sale Items</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Up to 50% off on selected items
              </p>
              <Link href="/shop/sale">
                <Button variant="outline">
                  Shop Sale
                </Button>
              </Link>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
              <h3 className="text-xl font-semibold mb-2">Best Sellers</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Most popular items this month
              </p>
              <Link href="/shop?sort=popular">
                <Button variant="outline">
                  View Popular
                </Button>
              </Link>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}