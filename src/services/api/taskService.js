class TaskService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to component-expected format
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        dueDate: task.due_date_c || null,
        priority: task.priority_c || 'medium',
        category: task.category_c || 'general',
        completed: task.completed_c || false,
        cropId: task.crop_id_c?.Id || null
      })) || [];
    } catch (error) {
      console.error("Error in taskService.getAll:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "crop_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch task ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Task not found");
      }

      // Transform database fields to component-expected format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        dueDate: task.due_date_c || null,
        priority: task.priority_c || 'medium',
        category: task.category_c || 'general',
        completed: task.completed_c || false,
        cropId: task.crop_id_c?.Id || null
      };
    } catch (error) {
      console.error(`Error in taskService.getById(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          due_date_c: taskData.dueDate || null,
          priority_c: taskData.priority || 'medium',
          category_c: taskData.category || 'general',
          completed_c: taskData.completed || false,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          // Transform back to component format
          return {
            Id: created.Id,
            title: created.title_c || '',
            description: created.description_c || '',
            dueDate: created.due_date_c || null,
            priority: created.priority_c || 'medium',
            category: created.category_c || 'general',
            completed: created.completed_c || false,
            cropId: created.crop_id_c?.Id || null
          };
        }
      }
    } catch (error) {
      console.error("Error in taskService.create:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      // Transform component data to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          due_date_c: taskData.dueDate || null,
          priority_c: taskData.priority || 'medium',
          category_c: taskData.category || 'general',
          completed_c: taskData.completed || false,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update task ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          // Transform back to component format
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            description: updated.description_c || '',
            dueDate: updated.due_date_c || null,
            priority: updated.priority_c || 'medium',
            category: updated.category_c || 'general',
            completed: updated.completed_c || false,
            cropId: updated.crop_id_c?.Id || null
          };
        }
      }
    } catch (error) {
      console.error(`Error in taskService.update(${id}):`, error?.response?.data?.message || error);
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
        console.error(`Failed to delete task ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error in taskService.delete(${id}):`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const taskService = new TaskService();