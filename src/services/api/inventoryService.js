// ApperClient integration for inventory_c table operations

// Initialize ApperClient for database operations
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
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "ItemName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Supplier_c"}},
          {"field": {"Name": "UnitCost_c"}},
          {"field": {"Name": "CurrentStock_c"}},
          {"field": {"Name": "MinimumStock_c"}},
          {"field": {"Name": "MaximumStock_c"}},
          {"field": {"Name": "Unit_c"}},
          {"field": {"Name": "StorageLocation_c"}},
          {"field": {"Name": "PurchaseDate_c"}},
          {"field": {"Name": "ExpiryDate_c"}},
          {"field": {"Name": "Notes_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('inventory_c', params);
      
      if (!response.success) {
        console.error('Failed to fetch inventory:', response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching inventory items:", error?.response?.data?.message || error);
      throw new Error('Failed to fetch inventory items');
    }
  },

  // Get inventory item by ID
async getById(id) {
    try {
      const apperClient = getApperClient();
      const recordId = parseInt(id);
      
      const params = {
        fields: [
          {"field": {"Name": "ItemName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Supplier_c"}},
          {"field": {"Name": "UnitCost_c"}},
          {"field": {"Name": "CurrentStock_c"}},
          {"field": {"Name": "MinimumStock_c"}},
          {"field": {"Name": "MaximumStock_c"}},
          {"field": {"Name": "Unit_c"}},
          {"field": {"Name": "StorageLocation_c"}},
          {"field": {"Name": "PurchaseDate_c"}},
          {"field": {"Name": "ExpiryDate_c"}},
          {"field": {"Name": "Notes_c"}}
        ]
      };

      const response = await apperClient.getRecordById('inventory_c', recordId, params);
      
      if (!response.success) {
        console.error(`Failed to fetch inventory item ${recordId}:`, response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory item ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  // Create new inventory item
async create(itemData) {
    try {
      // Validate required fields
      if (!itemData.ItemName_c || !itemData.Category_c) {
        throw new Error('Item name and category are required');
      }

      const apperClient = getApperClient();
      
      // Format data for ApperClient with exact database field names
      const formattedData = {
        ItemName_c: itemData.ItemName_c,
        Category_c: itemData.Category_c,
        Description_c: itemData.Description_c || "",
        Supplier_c: itemData.Supplier_c || "",
        UnitCost_c: parseFloat(itemData.UnitCost_c) || 0,
        CurrentStock_c: parseInt(itemData.CurrentStock_c) || 0,
        MinimumStock_c: parseInt(itemData.MinimumStock_c) || 0,
        MaximumStock_c: parseInt(itemData.MaximumStock_c) || 0,
        Unit_c: itemData.Unit_c || "",
        StorageLocation_c: itemData.StorageLocation_c || "",
        PurchaseDate_c: itemData.PurchaseDate_c || "",
        ExpiryDate_c: itemData.ExpiryDate_c || "",
        Notes_c: itemData.Notes_c || ""
      };

      const params = {
        records: [formattedData]
      };

      const response = await apperClient.createRecord('inventory_c', params);
      
      if (!response.success) {
        console.error('Failed to create inventory item:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} inventory records:`, failed);
          const errorMessage = failed[0].message || 'Failed to create inventory item';
          throw new Error(errorMessage);
        }
        return successful[0]?.data;
      }

      return response.results[0].data;
    } catch (error) {
      console.error("Error creating inventory item:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Update inventory item
async update(id, itemData) {
    try {
      const recordId = parseInt(id);
      const apperClient = getApperClient();
      
      // Format data for ApperClient with exact database field names
      const formattedData = {
        Id: recordId,
        ItemName_c: itemData.ItemName_c,
        Category_c: itemData.Category_c,
        Description_c: itemData.Description_c || "",
        Supplier_c: itemData.Supplier_c || "",
        UnitCost_c: parseFloat(itemData.UnitCost_c) || 0,
        CurrentStock_c: parseInt(itemData.CurrentStock_c) || 0,
        MinimumStock_c: parseInt(itemData.MinimumStock_c) || 0,
        MaximumStock_c: parseInt(itemData.MaximumStock_c) || 0,
        Unit_c: itemData.Unit_c || "",
        StorageLocation_c: itemData.StorageLocation_c || "",
        PurchaseDate_c: itemData.PurchaseDate_c || "",
        ExpiryDate_c: itemData.ExpiryDate_c || "",
        Notes_c: itemData.Notes_c || ""
      };

      const params = {
        records: [formattedData]
      };

      const response = await apperClient.updateRecord('inventory_c', params);
      
      if (!response.success) {
        console.error(`Failed to update inventory item ${recordId}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} inventory records:`, failed);
          const errorMessage = failed[0].message || 'Failed to update inventory item';
          throw new Error(errorMessage);
        }
        return successful[0]?.data;
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating inventory item ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

// Delete inventory item
  async delete(id) {
    try {
      const recordId = parseInt(id);
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [recordId]
      };

      const response = await apperClient.deleteRecord('inventory_c', params);
      
      if (!response.success) {
        console.error(`Failed to delete inventory item ${recordId}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} inventory records:`, failed);
          const errorMessage = failed[0].message || 'Failed to delete inventory item';
          throw new Error(errorMessage);
        }
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting inventory item ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  // Get items by category
async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "ItemName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Supplier_c"}},
          {"field": {"Name": "UnitCost_c"}},
          {"field": {"Name": "CurrentStock_c"}},
          {"field": {"Name": "MinimumStock_c"}},
          {"field": {"Name": "MaximumStock_c"}},
          {"field": {"Name": "Unit_c"}},
          {"field": {"Name": "StorageLocation_c"}},
          {"field": {"Name": "PurchaseDate_c"}},
          {"field": {"Name": "ExpiryDate_c"}},
          {"field": {"Name": "Notes_c"}}
        ],
        where: [{"FieldName": "Category_c", "Operator": "EqualTo", "Values": [category]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('inventory_c', params);
      
      if (!response.success) {
        console.error(`Failed to fetch inventory by category ${category}:`, response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching inventory items by category ${category}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  // Get low stock items
async getLowStockItems() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "ItemName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Supplier_c"}},
          {"field": {"Name": "UnitCost_c"}},
          {"field": {"Name": "CurrentStock_c"}},
          {"field": {"Name": "MinimumStock_c"}},
          {"field": {"Name": "MaximumStock_c"}},
          {"field": {"Name": "Unit_c"}},
          {"field": {"Name": "StorageLocation_c"}},
          {"field": {"Name": "PurchaseDate_c"}},
          {"field": {"Name": "ExpiryDate_c"}},
          {"field": {"Name": "Notes_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {"fieldName": "CurrentStock_c", "operator": "LessThanOrEqualTo", "values": ["MinimumStock_c"]}
            ],
            "operator": ""
          }]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('inventory_c', params);
      
      if (!response.success) {
        console.error('Failed to fetch low stock items:', response.message);
        throw new Error(response.message);
      }
return response.data || [];
    } catch (error) {
      console.error("Error fetching low stock items:", error?.response?.data?.message || error);
      return [];
    }
  },

// Update stock quantity
  async updateStock(id, newStock) {
    try {
      const recordId = parseInt(id);
      const stockValue = parseInt(newStock) || 0;
      
      // Use the update method with partial data
      const updatedItem = await this.update(recordId, {
        CurrentStock_c: stockValue
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
      const apperClient = getApperClient();
      
      // Get total items count
      const totalParams = {
        fields: [{"field": {"Name": "Id"}}],
        aggregators: [{
          "id": "totalItems",
          "fields": [{"field": {"Name": "Id"}, "Function": "Count"}]
        }]
      };

      // Get low stock items count
      const lowStockParams = {
        fields: [{"field": {"Name": "Id"}}],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {"fieldName": "CurrentStock_c", "operator": "LessThanOrEqualTo", "values": ["MinimumStock_c"]}
            ],
            "operator": ""
          }]
        }],
        aggregators: [{
          "id": "lowStockItems",
          "fields": [{"field": {"Name": "Id"}, "Function": "Count"}]
        }]
      };

      // Get categories count
      const categoriesParams = {
        fields: [{"field": {"Name": "Category_c"}}],
        groupBy: ["Category_c"]
      };

      const [totalResponse, lowStockResponse, categoriesResponse] = await Promise.all([
        apperClient.fetchRecords('inventory_c', totalParams),
        apperClient.fetchRecords('inventory_c', lowStockParams),
        apperClient.fetchRecords('inventory_c', categoriesParams)
      ]);

      if (!totalResponse.success) {
        console.error('Failed to fetch inventory statistics:', totalResponse.message);
        throw new Error(totalResponse.message);
      }

      const statistics = {
        totalItems: totalResponse.aggregators?.[0]?.value || 0,
        lowStockItems: lowStockResponse.aggregators?.[0]?.value || 0,
        categories: categoriesResponse.data?.length || 0,
        totalValue: 0 // Calculate from individual records if needed
      };

return statistics;
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