class FarmService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farm_c';
  }

  async getAll() {
    try {
      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_acres_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch farms:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to component-expected format
      return response.data?.map(farm => ({
        Id: farm.Id,
        name: farm.name_c || '',
        location: farm.location_c || '',
sizeAcres: farm.size_acres_c || 0,
        type: farm.type_c || '',
        notes: farm.notes_c || ''
      })) || [];
    } catch (error) {
      console.error("Error in farmService.getAll:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_acres_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch farm ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Farm not found");
      }

      // Transform database fields to component-expected format
      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.name_c || '',
        location: farm.location_c || '',
sizeAcres: farm.size_acres_c || 0,
        type: farm.type_c || '',
        notes: farm.notes_c || ''
      };
    } catch (error) {
      console.error(`Error in farmService.getById(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(farmData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
name_c: farmData.name || '',
          location_c: farmData.location || '',
          size_acres_c: parseFloat(farmData.sizeAcres) || 0,
          type_c: farmData.type || '',
          notes_c: farmData.notes || ''
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create farm:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          // Transform back to component format
          return {
            Id: created.Id,
name: created.name_c || '',
            location: created.location_c || '',
            sizeAcres: created.size_acres_c || 0,
            type: created.type_c || '',
            notes: created.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error in farmService.create:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: farmData.name || '',
location_c: farmData.location || '',
          size_acres_c: parseFloat(farmData.sizeAcres) || 0,
          type_c: farmData.type || '',
          notes_c: farmData.notes || ''
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update farm ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
const updated = successful[0].data;
          // Transform back to component format
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            location: updated.location_c || '',
            sizeAcres: updated.size_acres_c || 0,
            type: updated.type_c || '',
            notes: updated.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error(`Error in farmService.update(${id}):`, error?.response?.data?.message || error);
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
        console.error(`Failed to delete farm ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error in farmService.delete(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const farmService = new FarmService();

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete farm ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error in farmService.delete(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const farmService = new FarmService();