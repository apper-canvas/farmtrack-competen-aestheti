class IrrigationService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'irrigation_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "irrigation_type_c"}},
          {"field": {"Name": "water_source_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "water_used_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch irrigations:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to component-expected format
      return response.data?.map(irrigation => ({
        Id: irrigation.Id,
        name: irrigation.Name || '',
        irrigationType: irrigation.irrigation_type_c || '',
        waterSource: irrigation.water_source_c || '',
        schedule: irrigation.schedule_c || '',
        duration: irrigation.duration_c || 0,
        waterUsed: irrigation.water_used_c || 0
      })) || [];
    } catch (error) {
      console.error("Error in irrigationService.getAll:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "irrigation_type_c"}},
          {"field": {"Name": "water_source_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "water_used_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch irrigation ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Irrigation record not found");
      }

      // Transform database fields to component-expected format
      const irrigation = response.data;
      return {
        Id: irrigation.Id,
        name: irrigation.Name || '',
        irrigationType: irrigation.irrigation_type_c || '',
        waterSource: irrigation.water_source_c || '',
        schedule: irrigation.schedule_c || '',
        duration: irrigation.duration_c || 0,
        waterUsed: irrigation.water_used_c || 0
      };
    } catch (error) {
      console.error(`Error in irrigationService.getById(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(irrigationData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: irrigationData.name || '',
          irrigation_type_c: irrigationData.irrigationType || '',
          water_source_c: irrigationData.waterSource || '',
          schedule_c: irrigationData.schedule || '',
          duration_c: parseFloat(irrigationData.duration) || 0,
          water_used_c: parseFloat(irrigationData.waterUsed) || 0
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create irrigation:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} irrigations:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          // Transform back to component format
          return {
            Id: created.Id,
            name: created.Name || '',
            irrigationType: created.irrigation_type_c || '',
            waterSource: created.water_source_c || '',
            schedule: created.schedule_c || '',
            duration: created.duration_c || 0,
            waterUsed: created.water_used_c || 0
          };
        }
      }
    } catch (error) {
      console.error("Error in irrigationService.create:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, irrigationData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: irrigationData.name || '',
          irrigation_type_c: irrigationData.irrigationType || '',
          water_source_c: irrigationData.waterSource || '',
          schedule_c: irrigationData.schedule || '',
          duration_c: parseFloat(irrigationData.duration) || 0,
          water_used_c: parseFloat(irrigationData.waterUsed) || 0
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update irrigation ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} irrigations:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          // Transform back to component format
          return {
            Id: updated.Id,
            name: updated.Name || '',
            irrigationType: updated.irrigation_type_c || '',
            waterSource: updated.water_source_c || '',
            schedule: updated.schedule_c || '',
            duration: updated.duration_c || 0,
            waterUsed: updated.water_used_c || 0
          };
        }
      }
    } catch (error) {
      console.error(`Error in irrigationService.update(${id}):`, error?.response?.data?.message || error);
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
        console.error(`Failed to delete irrigation ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} irrigations:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error in irrigationService.delete(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const irrigationService = new IrrigationService();