class CropService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch crops:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to component-expected format
      return response.data?.map(crop => ({
        Id: crop.Id,
        name: crop.name_c || '',
        variety: crop.variety_c || '',
        plantingDate: crop.planting_date_c || null,
        expectedHarvest: crop.expected_harvest_c || null,
        fieldLocation: crop.field_location_c || '',
        quantity: crop.quantity_c || 0,
        status: crop.status_c || 'planted',
        notes: crop.notes_c || ''
      })) || [];
    } catch (error) {
      console.error("Error in cropService.getAll:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch crop ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Crop not found");
      }

      // Transform database fields to component-expected format
      const crop = response.data;
      return {
        Id: crop.Id,
        name: crop.name_c || '',
        variety: crop.variety_c || '',
        plantingDate: crop.planting_date_c || null,
        expectedHarvest: crop.expected_harvest_c || null,
        fieldLocation: crop.field_location_c || '',
        quantity: crop.quantity_c || 0,
        status: crop.status_c || 'planted',
        notes: crop.notes_c || ''
      };
    } catch (error) {
      console.error(`Error in cropService.getById(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(cropData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          name_c: cropData.name || '',
          variety_c: cropData.variety || '',
          planting_date_c: cropData.plantingDate || null,
          expected_harvest_c: cropData.expectedHarvest || null,
          field_location_c: cropData.fieldLocation || '',
          quantity_c: parseFloat(cropData.quantity) || 0,
          status_c: cropData.status || 'planted',
          notes_c: cropData.notes || ''
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create crop:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:`, failed);
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
            variety: created.variety_c || '',
            plantingDate: created.planting_date_c || null,
            expectedHarvest: created.expected_harvest_c || null,
            fieldLocation: created.field_location_c || '',
            quantity: created.quantity_c || 0,
            status: created.status_c || 'planted',
            notes: created.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error in cropService.create:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: cropData.name || '',
          variety_c: cropData.variety || '',
          planting_date_c: cropData.plantingDate || null,
          expected_harvest_c: cropData.expectedHarvest || null,
          field_location_c: cropData.fieldLocation || '',
          quantity_c: parseFloat(cropData.quantity) || 0,
          status_c: cropData.status || 'planted',
          notes_c: cropData.notes || ''
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update crop ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:`, failed);
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
            variety: updated.variety_c || '',
            plantingDate: updated.planting_date_c || null,
            expectedHarvest: updated.expected_harvest_c || null,
            fieldLocation: updated.field_location_c || '',
            quantity: updated.quantity_c || 0,
            status: updated.status_c || 'planted',
            notes: updated.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error(`Error in cropService.update(${id}):`, error?.response?.data?.message || error);
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
        console.error(`Failed to delete crop ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} crops:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error in cropService.delete(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const cropService = new CropService();