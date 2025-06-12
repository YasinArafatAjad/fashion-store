const { db } = require('../config/firebase');
const { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} = require('firebase/firestore');

/**
 * Product Controller
 * Handles all product-related operations
 */
class ProductController {
  
  /**
   * Get all products with optional filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllProducts(req, res) {
    try {
      const { 
        category, 
        subcategory, 
        minPrice, 
        maxPrice, 
        sortBy = 'createdAt', 
        order = 'desc',
        page = 1,
        limit: limitNum = 12,
        search
      } = req.query;

      let q = collection(db, 'products');
      
      // Apply filters
      const constraints = [];
      
      if (category) {
        constraints.push(where('category', '==', category));
      }
      
      if (subcategory) {
        constraints.push(where('subcategory', '==', subcategory));
      }
      
      if (minPrice) {
        constraints.push(where('price', '>=', parseFloat(minPrice)));
      }
      
      if (maxPrice) {
        constraints.push(where('price', '<=', parseFloat(maxPrice)));
      }

      // Add search functionality
      if (search) {
        constraints.push(where('searchKeywords', 'array-contains-any', 
          search.toLowerCase().split(' ')));
      }

      // Add sorting
      constraints.push(orderBy(sortBy, order));
      
      // Add pagination
      constraints.push(limit(parseInt(limitNum)));

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limitNum),
          total: products.length
        }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }
  }

  /**
   * Get single product by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const product = {
        id: docSnap.id,
        ...docSnap.data()
      };

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      });
    }
  }

  /**
   * Create new product (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createProduct(req, res) {
    try {
      const {
        name,
        description,
        price,
        salePrice,
        category,
        subcategory,
        images,
        sizes,
        colors,
        tags,
        inventory,
        specifications,
        seoTitle,
        seoDescription,
        seoKeywords
      } = req.body;

      // Validate required fields
      if (!name || !description || !price || !category || !images) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // Generate search keywords for better search functionality
      const searchKeywords = [
        ...name.toLowerCase().split(' '),
        ...description.toLowerCase().split(' '),
        category.toLowerCase(),
        subcategory?.toLowerCase(),
        ...tags?.map(tag => tag.toLowerCase()) || []
      ].filter(keyword => keyword.length > 2);

      const productData = {
        name,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        category,
        subcategory: subcategory || '',
        images,
        sizes: sizes || [],
        colors: colors || [],
        tags: tags || [],
        inventory: parseInt(inventory) || 0,
        specifications: specifications || {},
        searchKeywords: [...new Set(searchKeywords)], // Remove duplicates
        seo: {
          title: seoTitle || name,
          description: seoDescription || description,
          keywords: seoKeywords || tags || []
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        sales: 0,
        rating: 0,
        reviewCount: 0
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          id: docRef.id,
          ...productData
        }
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message
      });
    }
  }

  /**
   * Update existing product (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.views;
      delete updateData.sales;
      delete updateData.rating;
      delete updateData.reviewCount;

      // Update timestamp
      updateData.updatedAt = new Date().toISOString();

      // Update search keywords if name, description, or tags changed
      if (updateData.name || updateData.description || updateData.tags) {
        const searchKeywords = [
          ...(updateData.name?.toLowerCase().split(' ') || []),
          ...(updateData.description?.toLowerCase().split(' ') || []),
          updateData.category?.toLowerCase(),
          updateData.subcategory?.toLowerCase(),
          ...updateData.tags?.map(tag => tag.toLowerCase()) || []
        ].filter(keyword => keyword.length > 2);
        
        updateData.searchKeywords = [...new Set(searchKeywords)];
      }

      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, updateData);

      res.status(200).json({
        success: true,
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  }

  /**
   * Delete product (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }

  /**
   * Get featured products
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getFeaturedProducts(req, res) {
    try {
      const q = query(
        collection(db, 'products'),
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(8)
      );

      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured products',
        error: error.message
      });
    }
  }

  /**
   * Get products by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit: limitNum = 12, page = 1 } = req.query;

      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(parseInt(limitNum))
      );

      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json({
        success: true,
        data: products,
        category,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limitNum),
          total: products.length
        }
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products by category',
        error: error.message
      });
    }
  }
}

module.exports = ProductController;