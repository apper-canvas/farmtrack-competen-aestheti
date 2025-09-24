import inventoryData from '../mockData/inventory.json';

// Helper function for realistic delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate new ID
const generateId = () => {
  const maxId = inventoryData.reduce((max, item) => Math.max(max, item.Id), 0);
  return maxId + 1;
};

export const inventoryService = {
  // Get all inventory items
  async getAll() {
    await delay(300);
    return [...inventoryData];
  },

  // Get inventory item by ID
  async getById(id) {
    await delay(200);
    const item = inventoryData.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error('Inventory item not found');
    }
    return { ...item };
  },

  // Create new inventory item
  async create(itemData) {
    await delay(400);
    
    // Validate required fields
    if (!itemData.itemName || !itemData.category) {
      throw new Error('Item name and category are required');
    }

    const newItem = {
      ...itemData,
      Id: generateId(),
      currentStock: parseInt(itemData.currentStock) || 0,
      minStock: parseInt(itemData.minStock) || 0,
      maxStock: parseInt(itemData.maxStock) || 0,
      unitCost: parseFloat(itemData.unitCost) || 0
    };

    inventoryData.push(newItem);
    return { ...newItem };
  },

  // Update inventory item
  async update(id, itemData) {
    await delay(350);
    
    const index = inventoryData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Inventory item not found');
    }

    const updatedItem = {
      ...inventoryData[index],
      ...itemData,
      Id: parseInt(id),
      currentStock: parseInt(itemData.currentStock) || 0,
      minStock: parseInt(itemData.minStock) || 0,
      maxStock: parseInt(itemData.maxStock) || 0,
      unitCost: parseFloat(itemData.unitCost) || 0
    };

    inventoryData[index] = updatedItem;
    return { ...updatedItem };
  },

  // Delete inventory item
  async delete(id) {
    await delay(250);
    
    const index = inventoryData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Inventory item not found');
    }

    inventoryData.splice(index, 1);
    return { success: true };
  },

  // Get items by category
  async getByCategory(category) {
    await delay(200);
    return inventoryData.filter(item => item.category === category).map(item => ({ ...item }));
  },

  // Get low stock items
  async getLowStockItems() {
    await delay(200);
    return inventoryData.filter(item => item.currentStock <= item.minStock).map(item => ({ ...item }));
  },

  // Update stock quantity
  async updateStock(id, newStock) {
    await delay(250);
    
    const index = inventoryData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Inventory item not found');
    }

    inventoryData[index].currentStock = parseInt(newStock) || 0;
    return { ...inventoryData[index] };
  },

  // Get inventory statistics
  async getStatistics() {
    await delay(150);
    
    const totalItems = inventoryData.length;
    const lowStockItems = inventoryData.filter(item => item.currentStock <= item.minStock).length;
    const categories = [...new Set(inventoryData.map(item => item.category))];
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.unitCost * item.currentStock), 0);
    
    return {
      totalItems,
      lowStockItems,
      categories: categories.length,
      totalValue
    };
  }
};