import inventoryData from '../mockData/inventory.json';

// Helper function for realistic delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate new ID for mock data
const generateId = () => {
  const maxId = inventoryData.reduce((max, item) => Math.max(max, item.Id), 0);
  return maxId + 1;
};

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name - will be 'inventory_c' when database table is available
const TABLE_NAME = 'inventory_c'; // Currently using mock data as table not found

export const inventoryService = {
  // Get all inventory items
  async getAll() {
    try {
      // Since inventory_c table not found, using enhanced mock service with ApperClient patterns
      // When table becomes available, replace with ApperClient.fetchRecords call
      await delay(300);
      
      const apperClient = getApperClient();
      
      // Mock response in ApperClient format for consistency
      const response = {
        success: true,
        data: [...inventoryData],
        total: inventoryData.length
      };
      
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error?.response?.data?.message || error);
      throw new Error('Failed to fetch inventory items');
    }
  },

  // Get inventory item by ID
  async getById(id) {
    try {
      await delay(200);
      
      const apperClient = getApperClient();
      const recordId = parseInt(id);
      
      // Mock database operation - will be replaced with apperClient.getRecordById
      const item = inventoryData.find(item => item.Id === recordId);
      if (!item) {
        throw new Error('Inventory item not found');
      }
      
      const response = {
        success: true,
        data: { ...item }
      };
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory item ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  // Create new inventory item
  async create(itemData) {
    try {
      await delay(400);
      
      // Validate required fields
      if (!itemData.itemName || !itemData.category) {
        throw new Error('Item name and category are required');
      }

      const apperClient = getApperClient();
      
      // Format data for ApperClient (when database available)
      const formattedData = {
        itemName: itemData.itemName,
        category: itemData.category,
        description: itemData.description || "",
        supplier: itemData.supplier || "",
        unitCost: parseFloat(itemData.unitCost) || 0,
        currentStock: parseInt(itemData.currentStock) || 0,
        minStock: parseInt(itemData.minStock) || 0,
        maxStock: parseInt(itemData.maxStock) || 0,
        unit: itemData.unit || "",
        location: itemData.location || "",
        purchaseDate: itemData.purchaseDate || "",
        expiryDate: itemData.expiryDate || "",
        notes: itemData.notes || ""
      };

      // Mock database creation - will be replaced with apperClient.createRecord
      const newItem = {
        ...formattedData,
        Id: generateId()
      };

      inventoryData.push(newItem);
      
      const response = {
        success: true,
        results: [{
          success: true,
          data: { ...newItem }
        }]
      };

      return response.results[0].data;
    } catch (error) {
      console.error("Error creating inventory item:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Update inventory item
  async update(id, itemData) {
    try {
      await delay(350);
      
      const recordId = parseInt(id);
      const index = inventoryData.findIndex(item => item.Id === recordId);
      if (index === -1) {
        throw new Error('Inventory item not found');
      }

      const apperClient = getApperClient();
      
      // Format data for ApperClient (when database available)
      const formattedData = {
        Id: recordId,
        itemName: itemData.itemName,
        category: itemData.category,
        description: itemData.description || "",
        supplier: itemData.supplier || "",
        unitCost: parseFloat(itemData.unitCost) || 0,
        currentStock: parseInt(itemData.currentStock) || 0,
        minStock: parseInt(itemData.minStock) || 0,
        maxStock: parseInt(itemData.maxStock) || 0,
        unit: itemData.unit || "",
        location: itemData.location || "",
        purchaseDate: itemData.purchaseDate || "",
        expiryDate: itemData.expiryDate || "",
        notes: itemData.notes || ""
      };

      // Mock database update - will be replaced with apperClient.updateRecord
      const updatedItem = {
        ...inventoryData[index],
        ...formattedData
      };

      inventoryData[index] = updatedItem;
      
      const response = {
        success: true,
        results: [{
          success: true,
          data: { ...updatedItem }
        }]
      };

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating inventory item ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  // Delete inventory item
  async delete(id) {
    try {
      await delay(250);
      
      const recordId = parseInt(id);
      const index = inventoryData.findIndex(item => item.Id === recordId);
      if (index === -1) {
        throw new Error('Inventory item not found');
      }

      const apperClient = getApperClient();
      
      // Mock database deletion - will be replaced with apperClient.deleteRecord
      inventoryData.splice(index, 1);
      
      const response = {
        success: true,
        results: [{
          success: true,
          data: { Id: recordId }
        }]
      };

      return response.success;
    } catch (error) {
      console.error(`Error deleting inventory item ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  // Get items by category
  async getByCategory(category) {
    try {
      await delay(200);
      
      const apperClient = getApperClient();
      
      // Mock filtered query - will be replaced with ApperClient.fetchRecords with where conditions
      const filteredItems = inventoryData.filter(item => item.category === category);
      
      const response = {
        success: true,
        data: filteredItems.map(item => ({ ...item })),
        total: filteredItems.length
      };
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory items by category ${category}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  // Get low stock items
  async getLowStockItems() {
    try {
      await delay(200);
      
      const apperClient = getApperClient();
      
      // Mock filtered query - will be replaced with ApperClient.fetchRecords with where conditions
      const lowStockItems = inventoryData.filter(item => item.currentStock <= item.minStock);
      
      const response = {
        success: true,
        data: lowStockItems.map(item => ({ ...item })),
        total: lowStockItems.length
      };
      
      return response.data;
    } catch (error) {
      console.error("Error fetching low stock items:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Update stock quantity
  async updateStock(id, newStock) {
    try {
      await delay(250);
      
      const recordId = parseInt(id);
      const stockValue = parseInt(newStock) || 0;
      
      // Use the update method with partial data
      const updatedItem = await this.update(recordId, {
        currentStock: stockValue
      });
      
      return updatedItem;
    } catch (error) {
      console.error(`Error updating stock for item ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  // Get inventory statistics
  async getStatistics() {
    try {
      await delay(150);
      
      const apperClient = getApperClient();
      
      // Mock aggregation query - will be replaced with ApperClient.fetchRecords with aggregators
      const totalItems = inventoryData.length;
      const lowStockItems = inventoryData.filter(item => item.currentStock <= item.minStock).length;
      const categories = [...new Set(inventoryData.map(item => item.category))];
      const totalValue = inventoryData.reduce((sum, item) => sum + (item.unitCost * item.currentStock), 0);
      
      const response = {
        success: true,
        data: {
          totalItems,
          lowStockItems,
          categories: categories.length,
          totalValue
        }
      };
      
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory statistics:", error?.response?.data?.message || error);
      return {
        totalItems: 0,
        lowStockItems: 0,
        categories: 0,
        totalValue: 0
      };
    }
  }
};