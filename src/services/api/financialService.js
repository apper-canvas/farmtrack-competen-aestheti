class FinancialService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'financial_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch financials:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to component-expected format
      return response.data?.map(financial => ({
        Id: financial.Id,
        type: financial.type_c || 'expense',
        category: financial.category_c || '',
        amount: financial.amount_c || 0,
        description: financial.description_c || '',
        date: financial.date_c || null,
        cropId: financial.crop_id_c?.Id || null
      })) || [];
    } catch (error) {
      console.error("Error in financialService.getAll:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch financial ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Financial record not found");
      }

      // Transform database fields to component-expected format
      const financial = response.data;
      return {
        Id: financial.Id,
        type: financial.type_c || 'expense',
        category: financial.category_c || '',
        amount: financial.amount_c || 0,
        description: financial.description_c || '',
        date: financial.date_c || null,
        cropId: financial.crop_id_c?.Id || null
      };
    } catch (error) {
      console.error(`Error in financialService.getById(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(financialData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          type_c: financialData.type || 'expense',
          category_c: financialData.category || '',
          amount_c: parseFloat(financialData.amount) || 0,
          description_c: financialData.description || '',
          date_c: financialData.date || null,
          crop_id_c: financialData.cropId ? parseInt(financialData.cropId) : null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create financial record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} financial records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          // Transform back to component format
          return {
            Id: created.Id,
            type: created.type_c || 'expense',
            category: created.category_c || '',
            amount: created.amount_c || 0,
            description: created.description_c || '',
            date: created.date_c || null,
            cropId: created.crop_id_c?.Id || null
          };
        }
      }
    } catch (error) {
      console.error("Error in financialService.create:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, financialData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          type_c: financialData.type || 'expense',
          category_c: financialData.category || '',
          amount_c: parseFloat(financialData.amount) || 0,
          description_c: financialData.description || '',
          date_c: financialData.date || null,
          crop_id_c: financialData.cropId ? parseInt(financialData.cropId) : null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update financial record ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} financial records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          // Transform back to component format
          return {
            Id: updated.Id,
            type: updated.type_c || 'expense',
            category: updated.category_c || '',
            amount: updated.amount_c || 0,
            description: updated.description_c || '',
            date: updated.date_c || null,
            cropId: updated.crop_id_c?.Id || null
          };
        }
      }
    } catch (error) {
      console.error(`Error in financialService.update(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete financial record ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} financial records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error in financialService.delete(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const financialService = new FinancialService();